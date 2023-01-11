import { BaseControllerTypes } from '@l/common'
import { SampleModel } from '@c/model/sampleModel'

export interface ControllerTypes extends BaseControllerTypes {
  sample: {
    argType: void
    returnType: SampleModel
  }
}
