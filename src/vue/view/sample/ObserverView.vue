<script lang="ts" setup>
import {} from 'vue'

const observerTypeSample = `// /src/common/observerType.ts
`
const observerSample = `// /src/gas/observer/sampleObserver.ts
`
const eventSample = ` // /src/gas/controller/sampleEventController.ts
`
const mainSample = `// /src/gas/main.ts
`
</script>

<template>
  <v-card>
    <v-card-title>Observer</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            サーバ(gas)側で作成したイベントを検出しクライアント(vue)へイベント通知を送ることが可能
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            動作確認:
            <v-container fluid>
              <v-row align="stretch" justify="center">
                <v-col cols="3">
                  <v-text-field v-model.number="num1" type="number" :rules="numberRule" :loading="isLoading" />
                </v-col>
                <v-col cols="1" align-self="center">
                  +
                </v-col>
                <v-col cols="3">
                  <v-text-field v-model.number="num2" type="number" :rules="numberRule" :loading="isLoading" />
                </v-col>
                <v-col align-self="center">
                  <v-btn :loading="isLoading" @click="onClickRequest">
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

</style>