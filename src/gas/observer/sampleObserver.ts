import { observer, Observer } from '@l/gas'
import { ObserverType } from '@c/observerType'

export const sampleObserver: Observer<ObserverType, 'sampleObserver'> = {
  observe: async arg => {
    const event = await observer.observe('sample', arg.intervalMSec)
    switch (event) {
      case 'UPDATE':
        return arg.text + new Date().toLocaleString('ja-JP')
      default:
        return event
    }
  },
  stop: () => {
    observer.stop('sample')
  },
}
