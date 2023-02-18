import { BaseControllerTypes } from '@l/common'

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
}
