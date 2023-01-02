import { BaseControllerTypes } from '@c/bin/common'
import { SampleModel } from '@c/model/sampleModel'

export interface ControllerTypes extends BaseControllerTypes {
  sample: {
    argType: void
    returnType: SampleModel
  }
}
