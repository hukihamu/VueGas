import { observer, Observer } from '@l/gas'
import { ObserverType } from '@c/observerType'

export const sampleObserver: Observer<ObserverType, 'sampleObserver'> = {
  observe: async arg => {
    switch (await observer.observe('sample', arg.intervalMSec)) {
      case 'UPDATE':
        return arg.text + new Date().toLocaleString('ja-JP')
      case 'NONE':
        return
      case 'STOP':
        return 'STOP'
    }
  },
  stop: () => {
    observer.stop('sample')
  },
}
