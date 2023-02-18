import { Ref } from 'vue'
import { ObserverType } from '@c/observerType'
import { gasClient } from '@l/vue'

const useObserve = {
  start: <T extends keyof ObserverType>(name: Exclude<T, ''>, arg: ObserverType[T]['argType'], ref: Ref<ObserverType[T]['returnType']>) => {
    gasClient.observer<ObserverType>().observe(name, arg, ref).then()
  },
  stop: <T extends keyof ObserverType>(name: Exclude<T, ''>, key?: string) => {
    gasClient.observer<ObserverType>().stop(name, key)
  }
}

export default useObserve
