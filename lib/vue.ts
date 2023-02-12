import { RouteRecordRaw, createRouter, createWebHistory, Router } from 'vue-router'
import { createApp, Ref } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify, VuetifyOptions } from 'vuetify'
import App from '@l/App.vue'
import { BaseControllerTypes, BaseObserverTypes } from '@l/common'
import { components, directives } from '@l/vuetify'

/**
 *
 * @param routes ルーティングの設定 初回はルート `/` へ遷移
 * @param vuetifyOptions Vuetifyオプション テーマやブループリントの変更に利用
 */
export const initVue = (routes: RouteRecordRaw[], vuetifyOptions: VuetifyOptions = {components, directives}) => {
  router = createRouter({
    history: createWebHistory(),
    routes,
  })
  if (!vuetifyOptions.components) vuetifyOptions.components = components
  if (!vuetifyOptions.directives) vuetifyOptions.directives = directives
  createApp(App).use(router).use(createPinia()).use(createVuetify(vuetifyOptions)).mount('#app')
}
export let router: Router

interface GasControllerClient<C extends Required<BaseControllerTypes>> {
  send<K extends keyof C>(name: Exclude<K, ''>, arg?: C[K]['argType']): Promise<C[K]['returnType']>
}
function setControllerTypes<C extends BaseControllerTypes>(): GasControllerClient<C> {
  return {
    send: async <K extends keyof C>(name: Exclude<K, ''>, arg?: C[K]['argType']): Promise<C[K]['returnType']> => {
      return new Promise<C[K]['returnType']>((resolve, reject) => {
        google.script.run
          .withSuccessHandler(it => resolve(JSON.parse(it)))
          .withFailureHandler(error => reject(error))[name as string](arg)
      })
    },
  }
}
interface GasObserverClient<C extends Required<BaseObserverTypes>> {
  observe<K extends keyof C>(name: Exclude<K, ''>, arg: C[K]['argType'], ref: Ref<C[K]['returnType']>): Promise<void>
  stop<K extends keyof C>(name: Exclude<K, ''>): void
}
function setObserverTypes<C extends BaseObserverTypes>(): GasObserverClient<C> {
  return {
    observe: async <K extends keyof C>(
      name: Exclude<K, ''>,
      arg: C[K]['argType'],
      ref: Ref<C[K]['returnType']>
    ): Promise<void> => {
      let result: C[K]['returnType'] | null = ref.value
      while (result !== 'STOP') {
        ref.value = result
        result = await new Promise<C[K]['returnType']>((resolve, reject) => {
          google.script.run
            .withSuccessHandler(it => resolve(JSON.parse(it)))
            .withFailureHandler(error => reject(error))[name as string](arg)
        })
      }
      return
    },
    stop<K extends keyof C>(name: Exclude<K, ''>) {
      google.script.run[name as string]('stop')
    },
  }
}
export const gasClient = {
  controller: setControllerTypes,
  observer: setObserverTypes,
}
