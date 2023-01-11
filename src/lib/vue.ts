import { RouteRecordRaw, createRouter, createWebHistory, Router } from 'vue-router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@l/App.vue'
import { BaseControllerTypes, Config } from '@l/common'

export const initVue = (routes: RouteRecordRaw[]): InitVueOption => {
  router = createRouter({
    history: createWebHistory(),
    routes,
  })
  createApp(App).use(router).use(createPinia()).mount('#app')

  return initVueOption
}

const initVueOption: InitVueOption = {}

interface InitVueOption {
  // TODO optionがあれば
}
export let router: Router

interface GasClient<C extends Required<BaseControllerTypes>> {
  send<K extends keyof C>(name: Exclude<K, ''>, arg?: C[K]['argType']): Promise<C[K]['returnType']>
}
function setControllerTypes<C extends BaseControllerTypes>(): GasClient<C> {
  return {
    send: async <K extends keyof C>(name: Exclude<K, ''>, arg?: C[K]['argType']): Promise<C[K]['returnType']> => {
      return new Promise<C[K]['returnType']>((resolve, reject) => {
        google.script.run
          .withSuccessHandler(it => resolve(JSON.parse(it)))
          .withFailureHandler(error => reject(error))
          [name as string](arg)
      })
    },
  }
}
export const gasClient = {
  use: setControllerTypes,
}
