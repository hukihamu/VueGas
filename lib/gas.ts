import { BaseControllerTypes, BaseObserverTypes, config, ConfigKeysType, Logger } from '@l/common'

/**
 * initGlobalサンプル
 * ``` ts
 * (global, convertController) => {
 *   global.sample = convertController(sampleController)
 *   return global
 * }
 * ```
 */
export const initGas = <C extends BaseControllerTypes>(
  title: string,
  keys: ConfigKeysType,
  initGlobal: (
    global: { [name in keyof C]: GlobalFunction },
    convertController: (controller: Controller<C, any>) => GlobalFunction
  ) => { [name in keyof C]: GlobalFunction }
): InitGasOption => {
  global.doGet = (): GoogleAppsScript.HTML.HtmlOutput => {
    const vueConfig = {}
    for (const key of keys.vue.concat(keys.common)) {
      vueConfig[key] = PropertiesService.getScriptProperties().getProperty(key)
    }
    const gasHtml = HtmlService.createHtmlOutputFromFile('index')
    gasHtml.setContent(gasHtml.getContent().replace('<?= vueConfig ?>', JSON.stringify(vueConfig)))
    return gasHtml.setTitle(title)
  }
  initGlobal(global as any, controller => {
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
  useObserver: initGlobal => {
    initGlobal(global as any, observer => {
      return async (arg: any) => {
        try {
          gLogger.debug('arg: ', arg)
          if (!arg || typeof arg === 'string') {
            return observer.stop(arg)
          } else {
            const returnValue = await observer.observe(arg)
            gLogger.debug('return: ', returnValue)
            return JSON.stringify(returnValue)
          }
        } catch (e) {
          gLogger.error('Observerエラー:', e)
          throw e
        }
      }
    })
    return initGasOption
  },
}

export type Controller<C extends BaseControllerTypes, K extends keyof C> = (
  arg?: C[K]['argType']
) => Promise<C[K]['returnType']>
export type Observer<O extends BaseObserverTypes, K extends keyof O> = {
  /**
   *
   * @return 'STOP': イベント検出終了, 'NONE': イベント続行(イベントなし), O[K]['returnType']: イベント続行(イベントあり)
   */
  observe: (arg: O[K]['argType']) => Promise<Exclude<O[K]['returnType'], 'NONE' | 'STOP'> | 'STOP' | 'NONE'>
  stop: (key: string | undefined) => void
}

interface InitGasOption {
  useSpreadsheetDB: (...repository: { new (): BaseRepository<any> }[]) => InitGasOption
  useObserver: <O extends BaseObserverTypes>(
    initGlobal: (
      global: { [name in keyof O]: GlobalFunction },
      convertObserver: (controller: Observer<O, any>) => GlobalFunction
    ) => { [name in keyof O]: GlobalFunction }
  ) => InitGasOption
}

type GlobalFunction = (args: unknown) => Promise<unknown>

const OBSERVE_PROPERTY_KEY = 'OBSERVE'
/**
 * STOP イベント通知を終了する<br>
 * NONE イベントが発生しないままタイムアウト<br>
 * UPDATE 変更を検出<br>
 */
type ObserverFlag = 'STOP' | 'UPDATE' | 'NONE'
export const observer = {
  /**
   *
   * @param key ユーザの継続・停止を検出するプロパティキー。デフォはイベント検出にも用いる(1ユーザ1key)
   * @param intervalMSec 変更を検出する間隔。3分未満を設定
   * @param eventKey keyとは別のeventを検出に利用する("executeAs": "USER_DEPLOYING"の時に利用)
   */
  observe: async (key: string, intervalMSec: number, eventKey?: string): Promise<ObserverFlag> => {
    const startDate = Date.now()
    if (intervalMSec > 180000) intervalMSec = 180000
    while (Date.now() - startDate < 180000) {
      const property = JSON.parse(PropertiesService.getScriptProperties().getProperty(OBSERVE_PROPERTY_KEY) ?? '{}')
      if (property[eventKey ?? key] && property[eventKey ?? key] > startDate) {
        return 'UPDATE'
      }
      if (PropertiesService.getUserProperties().getProperty(key)) {
        PropertiesService.getUserProperties().deleteProperty(key)
        return 'STOP'
      }
      sleep(intervalMSec)
    }
    return 'NONE'
  },
  onUpdateEvent: (eventKey: string) => {
    const property = JSON.parse(PropertiesService.getScriptProperties().getProperty(OBSERVE_PROPERTY_KEY) ?? '{}')
    property[eventKey] = Date.now()
    PropertiesService.getScriptProperties().setProperty(OBSERVE_PROPERTY_KEY, JSON.stringify(property))
  },
  stop: (key: string) => {
    PropertiesService.getUserProperties().setProperty(key, 'STOP')
  },
}

export const getEmail = (): string => {
  return Session.getActiveUser().getEmail()
}

export const sleep = (mSec: number): void => {
  Utilities.sleep(mSec)
}

export const gLogger: Logger = {
  info: (label, data) => console.info(label, data),
  debug: (label, data) => {
    if (config.gas('debug') === 'true') console.log(label, data)
  },
  warn: (label, data) => console.warn(label, data),
  error: (label, data) => console.error(label, data),
}

export type InitEntity<E extends BaseEntity> = Omit<E, 'row'>

export interface BaseEntity {
  row: number
}

type LockType = 'user' | 'script' | 'none'

export abstract class BaseRepository<E extends BaseEntity> {
  private sheet: GoogleAppsScript.Spreadsheet.Sheet
  private static readonly TABLE_VERSION_LABEL = 'ver:'
  private static readonly DELETE_LABEL = 'DELETE'
  private static readonly ROW_FUNCTION = '=row()'
  private readonly spreadsheetId: string

  protected abstract readonly tableVersion: number
  protected abstract readonly columnList: (keyof InitEntity<E>)[]
  protected readonly initData: InitEntity<E>[] = []
  lockType: LockType = 'user'

  protected constructor(spreadsheetId: string, tableName: string) {
    this.spreadsheetId = spreadsheetId
    // シートの取得(作成)

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
    const sheet = spreadsheet.getSheetByName(tableName)
    this.sheet = sheet ? sheet : spreadsheet.insertSheet().setName(tableName)
  }

  private checkVersionUpdated(): boolean {
    return this.sheet.getRange(1, 1, 1, 1).getValue() !== BaseRepository.TABLE_VERSION_LABEL + this.tableVersion
  }

  private createTable(): void {
    // DataRangeが1行より多い場合、データはあると判断
    if (this.sheet.getDataRange().getValues().length > 1) {
      const oldVersion = this.sheet.getRange(1, 1, 1, 1).getValue()
      const oldSheet = this.sheet.copyTo(SpreadsheetApp.openById(this.spreadsheetId))
      const oldName = oldSheet.getName().replace(' のコピー', ' old' + oldVersion)
      oldSheet.setName(oldName)
      this.sheet.clear()
    }
    // バージョン情報をセット
    this.sheet.getRange(1, 1, 1, 1).setValue(BaseRepository.TABLE_VERSION_LABEL + this.tableVersion)
    //ヘッダーをセット
    this.sheet.getRange(1, 2, 1, this.columnList.length).setValues([this.columnList])
    //初期データをインサート
    for (const e of this.initData) {
      this.insert(e)
    }
  }

  private toStringList(entity: E | InitEntity<E>): string[] {
    const result: string[] = []
    result.push(BaseRepository.ROW_FUNCTION)
    for (const key of this.columnList) {
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
      const key = this.columnList[i - 1]
      entity[key] = JSON.parse(stringList[i])
    }
    return entity as E
  }

  private getRowRange(rowNumber: number): GoogleAppsScript.Spreadsheet.Range {
    return this.sheet.getRange(rowNumber, 1, 1, this.columnList.length + 1)
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

  insert(entity: E | InitEntity<E>): void {
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
      const values = this.sheet.getRange(2, 1, this.sheet.getLastRow() - 1, this.columnList.length + 1).getValues()
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
