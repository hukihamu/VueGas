import { BaseControllerTypes, Logger, throwMsg } from '@c/bin/common'
export const initGas = <C extends BaseControllerTypes>(
  title: string,
  initGlobal: (
    global: { [name in keyof C]: GlobalController },
    convertController: (controller: Controller<C, any>) => GlobalController
  ) => { [name in keyof C]: GlobalController }): InitGasOption => {
  global.doGet = (): GoogleAppsScript.HTML.HtmlOutput => {
    return HtmlService.createHtmlOutputFromFile('index').setTitle(title)
  }
  initGlobal(global as any, (controller) => {
    return async (arg: unknown) => {
      try {
        gLogger.debug('arg: ', arg)
        const returnValue = await controller(arg)
        gLogger.debug('return: ', returnValue)
        return JSON.stringify(returnValue)
      } catch (e) {
        gLogger.error('Controllerエラー:', e)
        throw e
      }
    }
  })
  return initGasOption
}
const initGasOption: InitGasOption = {
  useSpreadsheetDB: (...repositoryList: { new (): BaseRepository<any> }[]) => {
    for (const repository of repositoryList) {
      new repository().initTable()
    }
    return initGasOption
  },
}

export type Controller<C extends BaseControllerTypes, K extends keyof C> = (
  arg?: C[K]['argType']
) => Promise<C[K]['returnType']>

interface InitGasOption {
  useSpreadsheetDB: (...repository: { new (): BaseRepository<any> }[]) => InitGasOption
}
type GlobalController = (args: unknown) => Promise<unknown>

export const getEmail = (): string => {
  return Session.getActiveUser().getEmail()
}

export const sleep = (mSec: number): void => {
  Utilities.sleep(mSec)
}

export const gLogger: Logger = {
  info: (label, data) => console.info(label, data),
  debug: (label, data) => {
    if (gConfig.debug) console.log(label, data)
  },
  warn: (label, data) => console.warn(label, data),
  error: (label, data) => console.error(label, data),
}

export class GoogleDriveFolder {
  private readonly folder: GoogleAppsScript.Drive.Folder

  constructor(folderId: string | GoogleAppsScript.Drive.Folder) {
    if (typeof folderId === 'string') {
      this.folder = DriveApp.getFolderById(folderId)
    } else {
      this.folder = folderId
    }
  }

  static createFolder(name: string): GoogleDriveFolder {
    const id = DriveApp.getFolderById(gConfig.rootFolderId).createFolder(name)
    return new GoogleDriveFolder(id)
  }

  get folderId(): string {
    return this.folder.getId()
  }

  createFile(blob: GoogleAppsScript.Base.Blob): GoogleDriveFile {
    return new GoogleDriveFile(this.folder.createFile(blob))
  }
  getFiles(): GoogleDriveFile[] {
    const result: GoogleDriveFile[] = []
    const files = this.folder.getFiles()
    while (files.hasNext()) {
      result.push(new GoogleDriveFile(files.next()))
    }
    return result
  }
  getFolders(): GoogleDriveFolder[] {
    const result: GoogleDriveFolder[] = []
    const folders = this.folder.getFolders()
    while (folders.hasNext()) {
      result.push(new GoogleDriveFolder(folders.next()))
    }
    return result
  }
  rename(newName: string): void {
    this.folder.setName(newName)
  }
  copyFromFile(fromFileId: string): void {
    const file = DriveApp.getFileById(fromFileId).makeCopy().moveTo(this.folder)
    file.setName(file.getName().replace(' のコピー', ''))
  }

  moveAllFile(toFolderId: string): void {
    const toFolder = DriveApp.getFolderById(toFolderId)
    const files = this.folder.getFiles()
    while (files.hasNext()) {
      files.next().moveTo(toFolder)
    }
  }
  trash(isTrash: boolean = true): void {
    this.folder.setTrashed(isTrash)
  }
}
export class GoogleDriveFile {
  private readonly file: GoogleAppsScript.Drive.File

  constructor(fileId: string | GoogleAppsScript.Drive.File) {
    if (typeof fileId === 'string') {
      this.file = DriveApp.getFileById(fileId)
    } else {
      this.file = fileId
    }
  }

  static trash(fileId: string, isTrash: boolean = true) {
    DriveApp.getFileById(fileId).setTrashed(isTrash)
  }
}

export const getHtmlConfig = (id: string): string => {
  const content = HtmlService.createHtmlOutputFromFile('config').getContent()
  return (
    Parser.data(content).from(`<span id="${id}">`).to('</span>').iterate()[0] ??
    throwMsg(`configId:"${id}"が見つかりませんでした。`)
  )
}

const gConfig = {
  debug: getHtmlConfig('debug').toUpperCase() === 'TRUE',
  spreadsheetId: getHtmlConfig('spreadsheetId'),
  rootFolderId: getHtmlConfig('rootFolderId'),
}

export interface BaseEntity {
  row: number
}
type LockType = 'user' | 'script' | 'none'
export abstract class BaseRepository<E extends BaseEntity> {
  private sheet: GoogleAppsScript.Spreadsheet.Sheet
  private _fixColumnList: (keyof E)[] | undefined = undefined
  private static readonly TABLE_VERSION_LABEL = 'ver:'
  private static readonly DELETE_LABEL = 'DELETE'
  private static readonly ROW_FUNCTION = '=row()'

  protected abstract readonly tableVersion: number
  protected abstract readonly columnList: (keyof E)[]

  lockType: LockType = 'user'

  protected constructor(tableName: string) {
    // シートの取得(作成)
    const spreadsheet = SpreadsheetApp.openById(gConfig.spreadsheetId)
    const sheet = spreadsheet.getSheetByName(tableName)
    this.sheet = sheet ? sheet : spreadsheet.insertSheet().setName(tableName)
  }

  /**
   * rowが含まれている可能性があるため、修正
   * @private
   */
  private get fixColumnList(): (keyof E)[] {
    return (
      this._fixColumnList ??
      (() => {
        const temp = this.columnList.filter(it => it !== 'row')
        this._fixColumnList = temp
        return temp
      })()
    )
  }

  private checkVersionUpdated(): boolean {
    return this.sheet.getRange(1, 1, 1, 1).getValue() !== BaseRepository.TABLE_VERSION_LABEL + this.tableVersion
  }
  private createTable(): void {
    // DataRangeが1行より多い場合、データはあると判断
    if (this.sheet.getDataRange().getValues().length > 1) {
      const oldVersion = this.sheet.getRange(1, 1, 1, 1).getValue()
      const oldSheet = this.sheet.copyTo(SpreadsheetApp.openById(gConfig.spreadsheetId))
      const oldName = oldSheet.getName().replace(' のコピー', ' old' + oldVersion)
      oldSheet.setName(oldName)
      this.sheet.clear()
    }
    // バージョン情報をセット
    this.sheet.getRange(1, 1, 1, 1).setValue(BaseRepository.TABLE_VERSION_LABEL + this.tableVersion)
    //ヘッダーをセット
    this.sheet.getRange(1, 2, 1, this.fixColumnList.length).setValues([this.fixColumnList])
  }
  private toStringList(entity: E): string[] {
    const result: string[] = []
    result.push(BaseRepository.ROW_FUNCTION)
    for (const key of this.fixColumnList) {
      const value = entity[key] ?? ''
      result.push(JSON.stringify(value))
    }
    return result
  }
  private toEntity(stringList: string[]): E {
    const entity: any = {
      row: stringList[0],
    }

    for (let i = 1; i < stringList.length; i++) {
      const key = this.fixColumnList[i - 1]
      entity[key] = JSON.parse(stringList[0])
    }
    return entity as E
  }
  private getRowRange(rowNumber: number): GoogleAppsScript.Spreadsheet.Range {
    return this.sheet.getRange(rowNumber, 1, 1, this.fixColumnList.length + 1)
  }
  private onLock<R>(runningInLock: () => R): R {
    if (this.lockType === 'none') return runningInLock()
    const lock = this.lockType === 'user' ? LockService.getUserLock() : LockService.getScriptLock()
    try {
      lock.waitLock(10000)
      const result = runningInLock()
      SpreadsheetApp.flush()
      return result
    } finally {
      lock.releaseLock()
    }
  }
  initTable(): void {
    if (this.checkVersionUpdated()) {
      this.createTable()
    }
  }
  insert(entity: E): void {
    this.onLock(() => {
      let insertRowNumber = -1
      const values = this.sheet.getDataRange().getValues()
      for (let i = 1; i < values.length; i++) {
        if (values[i][0] === BaseRepository.DELETE_LABEL) {
          insertRowNumber = i + 1
          break
        }
      }
      const insertData = this.toStringList(entity)
      if (insertRowNumber === -1) {
        // 最後尾に挿入
        this.sheet.appendRow(insertData)
      } else {
        // 削除行に挿入
        this.getRowRange(insertRowNumber).setValues([insertData])
      }
    })
  }
  getAll(): E[] {
    return this.onLock(() => {
      const values = this.sheet.getRange(2, 1, this.sheet.getLastRow() - 1, this.fixColumnList.length + 1).getValues()
      const entities: E[] = []
      for (const value of values) {
        if (!value[0]) break
        if (value[0] === BaseRepository.DELETE_LABEL) continue
        entities.push(this.toEntity(value))
      }
      return entities
    })
  }
  getByRow(row: number): E {
    return this.onLock(() => {
      const stringList = this.getRowRange(row).getValues()[0]
      return this.toEntity(stringList)
    })
  }
  update(entity: E): void {
    this.onLock(() => {
      this.getRowRange(entity.row).setValues([this.toStringList(entity)])
    })
  }
  delete(row: number): void {
    this.onLock(() => {
      const range = this.getRowRange(row)
      range.clear()
      range.setValue(BaseRepository.DELETE_LABEL)
    })
  }
}
