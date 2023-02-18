import { BaseObserverTypes } from '@l/common'
import { ObserverSampleReturnModel } from '@c/model/observerSampleReturnModel'

export interface ObserverType extends BaseObserverTypes {
  observerSample: {
    argType: {
      intervalMSec: number
      model: ObserverSampleArgsModel
    }
    returnType: ObserverSampleReturnModel
  }
}
