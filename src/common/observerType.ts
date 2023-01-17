import { BaseObserverTypes } from '@l/common'

export interface ObserverType extends BaseObserverTypes {
  sampleObserver: {
    argType: {
      intervalMSec: number
      text: string
    }
    returnType?: string
  }
}
