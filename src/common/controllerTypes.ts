import { BaseControllerTypes } from '@l/common'
import { SampleEntity } from '@g/entity/sampleEntity'
import { SpreadsheetSampleModel } from '@c/model/spreadsheetSampleModel'

export interface ControllerTypes extends BaseControllerTypes {
  controllerSample: {
    argType: ControllerSampleArgsModel
    returnType: ControllerSampleReturnModel
  }
  setConfig: {
    argType: {
      configName: string
      text: string
    }
    returnType: void
  }
  sampleSpreadsheet: {
    argType: {
      crud: 'c' | 'r' | 'u' | 'd'
      id?: number
      text?: string
      num?: number
    }
    returnType: SpreadsheetSampleModel[]
  }
}
