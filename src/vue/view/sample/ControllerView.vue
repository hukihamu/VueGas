<script lang="ts" setup>
import {ref} from 'vue'
import { gasClient } from '@l/vue'
import { ControllerTypes } from '@c/controllerTypes'
import sendController from '@v/util/sendController'

const num1 = ref(0)
const num2 = ref(0)
function onClickRequest() {
  // gasClient
  //   .controller<ControllerTypes>()
  //   .send('controllerSample',
  //     {num1: num1.value, num2: num2.value})
  sendController('controllerSample', {num1: num1.value, num2: num2.value})
    .then(it => {
      alert(`Controllerへの接続成功\n和: ${it.result}\ntext: ${it.text}`)
    })
}
const numberRule = [
  value => !!value || '数値を入力'
]
const controllerTypeSample = `// /src/common/controllerType.ts
import { BaseControllerTypes } from '@l/common'

export interface ControllerTypes extends BaseControllerTypes {
  controllerSample: {
    argType: ControllerSampleArgsModel
    returnType: ControllerSampleReturnModel
  }
}
`
const controllerSample = `// /src/gas/controller/sampleController.ts
import { Controller } from '@l/gas'
import { ControllerTypes } from '@c/controllerTypes'

export const sampleController: Controller&lt;ControllerTypes, 'controllerSample'> = async (args) => {
  if (!args) throw 'サンプルコントローラーでエラーが発生'
  return {
    result: args.num1 + args.num2,
    text: 'result text',
  }
}

`.replaceAll('&lt;', '<')
const mainSample = `// /src/gas/main.ts
import { initGas } from '@l/gas'
import { sampleController } from '@g/controller/sampleController'
import { configKeys } from '@c/config'
import { ControllerTypes } from '@c/controllerTypes'

initGas&lt;ControllerTypes>('VueGasSample', configKeys, (global, convertController) => {
  global.controllerSample = convertController(sampleController)
  return global
})
`.replaceAll('&lt;', '<')
const vueSample = `// /src/vue/view/sample/ControllerView.vue
import { gasClient } from '@l/vue'
import { ControllerTypes } from '@c/controllerTypes'
function onClickRequest() {
  gasClient
    .controller&lt;ControllerTypes>()
    .send('controllerSample',
      {num1: num1.value, num2: num2.value})
    .then(it => {
      alert(\`Controllerへの接続成功\\n和: \${it.result}\\ntext: \${it.text}\`)
    })
}
`.replaceAll('&lt;', '<')
const wrapperVue = `
async function sendController&lt;T extends keyof ControllerTypes>(
  name: Exclude&lt;T, ''>,
  arg?: ControllerTypes[T]['argType']): Promise&lt;ControllerTypes[T]['returnType']>{
  return gasClient.controller&lt;ControllerTypes>().send(name, arg)
}
export default sendController
`.replaceAll('&lt;', '<')
</script>

<template>
  <v-card>
    <v-card-title>Controller</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            サーバ(gas)側で処理を行うようにクライアント(vue)からリクエストを行うことが可能
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            動作確認:
            <v-container fluid>
              <v-row align="stretch" justify="center">
                <v-col cols="3">
                  <v-text-field v-model.number="num1" type="number" :rules="numberRule" />
                </v-col>
                <v-col cols="1" align-self="center">
                  +
                </v-col>
                <v-col cols="3">
                  <v-text-field v-model.number="num2" type="number" :rules="numberRule"/>
                </v-col>
                <v-col align-self="center">
                  <v-btn @click="onClickRequest">
                    リクエスト
                  </v-btn>
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
            <code class="v-code">BaseControllerTypes</code> を実装したInterfaceを作成<br>
            参考:
            <v-code class="code">
              {{ controllerTypeSample }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <code class="v-code">BaseControllerTypes</code> を実装したInterfaceを元にControllerを作成<br>
            ※引数の型はundefinedを足されるため、nullチェックを行う必要がある<br>
            参考:
            <v-code class="code">
              {{ controllerSample }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            作成したControllerをgasに登録<br>
            ※引数名globalは固定(別名に変換すると失敗する)<br>
            ※作成したControllerは<code class="v-code">convertController</code>を通す<br>
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
            <code>gasClient</code>を利用して、Controllerへリクエストを行う<br>
            ※<code>.controller&lt;実装したインターフェース&gt;()</code>のようにジェネリクスを設定すれば、予測入力が可能となる<br>
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