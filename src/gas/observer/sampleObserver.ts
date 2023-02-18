import { observer, Observer } from '@l/gas'
import { ObserverType } from '@c/observerType'

export const sampleObserver: Observer<ObserverType, 'observerSample'> = {
  observe: async arg => {
    // 1ユーザ内でもイベントを分けたいため、keyを一意としeventKeyを利用
    const event = await observer.observe('sample_' + arg.model.userToken, arg.intervalMSec, 'sampleEvent')
    switch (event) {
      case 'UPDATE':
        return {
          timestamp: new Date().toLocaleString('ja-JP'),
          value: PropertiesService.getScriptProperties().getProperty(arg.model.configName) ?? ''
        }
        // 'NONE', 'STOP' 時必要な処理はないためそのままreturn
      default:
        return event
    }
  },
  stop: (key) => {
    // 1ユーザ内でもイベントを分けたいため、eventKeyを利用
    observer.stop('sample_' + key)
  },
}
