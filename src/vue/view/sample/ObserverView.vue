<script lang="ts" setup>
import { ref, watch} from 'vue'
import { ObserverSampleReturnModel } from '@c/model/observerSampleReturnModel'
import { gasClient } from '@l/vue'
import { ObserverType } from '@c/observerType'
import sendController from '@v/util/sendController'

const toggleIndex = ref(1)
const userToken = Date.now().toString()
const configName = 'observerSampleText'
const text = ref('')
const isLoading = ref(false)
const observeEvent = ref<ObserverSampleReturnModel>({value: '', timestamp: ''})
watch(toggleIndex, newValue => {
  switch (newValue) {
    case 0 :
      gasClient.observer<ObserverType>().observe(
        'observerSample',
        {intervalMSec: 1000, model: {configName, userToken }},
        observeEvent)
      break
    case 1:
      gasClient.observer<ObserverType>().stop('observerSample', userToken)
      break
  }
})
const onClickRequest = () => {
  isLoading.value = true
  sendController('setConfig', {configName, text: text.value}).then(() => {
    isLoading.value = false
  })
}

const observerTypeSample = `// /src/common/observerType.ts
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
`
const observerSample = `// /src/gas/observer/sampleObserver.ts
import { observer, Observer } from '@l/gas'
import { ObserverType } from '@c/observerType'

export const sampleObserver: Observer&lt;ObserverType, 'observerSample'> = {
  useObserver: async arg => {
    // 1ユーザ内でもイベントを分けたいため、keyを一意としeventKeyを利用
    const event = await observer.useObserver('sample_' + arg.model.userToken, arg.intervalMSec, 'sampleEvent')
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

`.replaceAll('&lt;', '<')
const eventSample = ` // /src/gas/controller/setConfig.ts
export const setConfig: Controller&lt;ControllerTypes, 'setConfig'> = async (arg) => {
  if (!arg) throw 'setConfigでエラーが発生'
  PropertiesService.getScriptProperties().setProperty(arg.configName, arg.text)
  observer.onUpdateEvent('sampleEvent')
}
`.replaceAll('&lt;', '<')
const mainSample = `// /src/gas/main.ts
initGas(/*省略*/)
  .useObserver&lt;ObserverType>((global, convertObserver) => {
    global.observerSample = convertObserver(sampleObserver)
    return global
  })
`.replaceAll('&lt;', '<')
const vueSample = `// /src/vue/view/sample/ObserverView.vue
import { ref, watch} from 'vue'
import { ObserverSampleReturnModel } from '@c/model/observerSampleReturnModel'
import { gasClient } from '@l/vue'
import { ObserverType } from '@c/observerType'

const toggleIndex = ref(1)
const userToken = Date.now().toString()
const configName = 'observerSampleText'
const observeEvent = ref&lt;ObserverSampleReturnModel>({value: '', timestamp: ''})
watch(toggleIndex, newValue => {
  switch (newValue) {
    case 0 :
      gasClient.observer&lt;ObserverType>().observe(
        'observerSample',
        {intervalMSec: 1000, model: {configName, userToken }},
        observeEvent)
      break
    case 1:
      gasClient.observer&lt;ObserverType>().stop('observerSample', userToken)
      break
  }
})
`.replaceAll('&lt;', '<')
const wrapperVue = `// /src/vue/util/useObserve.ts
const useObserve = {
  start: &lt;T extends keyof ObserverType>(name: Exclude&lt;T, ''>, arg: ObserverType[T]['argType'], ref: Ref&lt;ObserverType[T]['returnType']>) => {
    gasClient.observer&lt;ObserverType>().observe(name, arg, ref).then()
  },
  stop: &lt;T extends keyof ObserverType>(name: Exclude&lt;T, ''>, key?: string) => {
    gasClient.observer&lt;ObserverType>().stop(name, key)
  }
}
`.replaceAll('&lt;', '<')
</script>

<template>
  <v-card>
    <v-card-title>Observer</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            サーバ(gas)側で作成したイベントを検出しクライアント(vue)へイベント通知を送ることが可能<br>
            他ユーザや同一ユーザの別タブなどの操作をまとめて検出できる<br>
            ※gasへの接続タイムアウト前に再接続することで実現<br>
            　イベントの検出待機に最大3分待機するため、gasの接続タイムアウト5分から引いた2分が処理時間となる<br>
            　2分を超える場合は別途Controllerを用意して対応する
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            動作確認:
            <v-container fluid>
              <v-row align="stretch" justify="center">
                <v-col align-self="center">
                  <v-btn-toggle v-model="toggleIndex" mandatory>
                    <v-btn>
                      イベント検出開始
                    </v-btn>
                    <v-btn>
                      イベント検出終了
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col>
                  <v-text-field v-model="text" :loading="isLoading" />
                </v-col>
                <v-col align-self="center">
                  <v-btn :loading="isLoading" @click="onClickRequest">
                    イベント発生
                  </v-btn>
                </v-col>
              </v-row>
              <v-row align="stretch" justify="center">
                <v-col align-self="center">
                  取得テキスト: {{ observeEvent.value }}
                </v-col>
                <v-col align-self="center">
                  取得時間: {{ observeEvent.timestamp }}
                </v-col>
              </v-row>
            </v-container>
          </v-list-item-title>
        </v-list-item>
        <v-list-subheader>
          サーバ(gas)側
        </v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            <code class="v-code">BaseObserverTypes</code> を実装したInterfaceを作成<br>
            参考:
            <v-code class="code">
              {{ observerTypeSample }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <code class="v-code">BaseObserverTypes</code> を実装したInterfaceを元にObserverを作成<br>
            参考:
            <v-code class="code">
              {{ observerSample }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            検出したいイベントを作成<br>
            参考:
            <v-code class="code">
              {{ eventSample }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            作成したObserverをgasに登録<br>
            ※引数名globalは固定(別名に変換すると失敗する)<br>
            ※作成したObserverは<code class="v-code">convertObserver</code>を通す<br>
            ※global.変数名は、実装したInterface内の名前と同名にする<br>
            参考:
            <v-code class="code">
              {{ mainSample }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-subheader>
          クライアント(vue)側
        </v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            <code>gasClient</code>を利用して、Observerへリクエストを行う<br>
            ※<code>.observer&lt;実装したインターフェース&gt;()</code>のようにジェネリクスを設定すれば、予測入力が可能となる<br>
            参考:
            <v-code class="code">
              {{ vueSample }}
            </v-code>
            使いやすく包むのもあり:
            <v-code class="code">
              {{ wrapperVue }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.code {
  white-space: pre-wrap;
}
</style>