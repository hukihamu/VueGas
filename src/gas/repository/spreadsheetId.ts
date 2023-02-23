import { getConfig } from '@c/config'
import { throwMsg } from '@l/common'

export const spreadsheetId = getConfig.gas('spreadsheetId') ?? throwMsg('spreadsheetIdがコンテンツプロパティに設定されていません')