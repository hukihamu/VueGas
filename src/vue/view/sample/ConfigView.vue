<script lang="ts" setup>
import {} from 'vue'
const keysSample = `// /src/common/config.ts
export const configKeys = {
  common: ['debug'],
  vue: ['vueConfig'],
  gas: ['spreadsheetId'],
} as const
`
const mainSample = `// /src/gas/main.ts
import { configKeys } from '@c/config'

initGas(/*省略*/, configKeys, /*省略*/)
`
const configSample = `// 実装部 /src/common/config.ts
import { config } from '@l/common'

type ConfigType = {
  common: typeof configKeys['common'][number]
  vue: typeof configKeys['vue'][number]
  gas: typeof configKeys['gas'][number]
}

export const getConfig = {
  vue: (key: Exclude&lt;ConfigType['vue'], ''> | ConfigType['common']) => {
    return config.vue&lt;ConfigType>(key)
  },
  gas: (key: Exclude&lt;ConfigType['gas'], ''> | ConfigType['common']) => {
    return config.gas&lt;ConfigType>(key)
  },
}

/*---------------------------------------------------------------------------*/
// 利用部 /src/gas/repository/sampleRepository.ts
import { throwMsg } from '@l/common'
import { getConfig } from '@c/config'

getConfig.gas('spreadsheetId') ?? throwMsg('spreadsheetId not found')
`.replaceAll('&lt;', '<')
</script>

<template>
  <v-card>
    <v-card-title>スクリプトプロパティ利用</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            APIキーなどのコードに埋め込まない値やコンパイルせずに値を変更したい場合は、gasの「スクリプトプロパティ」に設置することで利用可能
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            「common」「vue」「gas」3つのスコープのプロパティを設定可能
          </v-list-item-title>
          <v-list-item-subtitle>
            common: サーバ・クライアント両方に適用されるプロパティ
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            vue: クライアントのみに適用されるプロパティ(値が平文で埋め込まれるため、APIキーなどでの利用は避ける)
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            gas: サーバのみに適用されるプロパティ
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-subheader>
          GasProject設定
        </v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            <code class="v-code">GasProject > 設定 > スクリプト プロパティ</code>にプロパティを設定する
          </v-list-item-title>
        </v-list-item>
        <v-list-subheader>
          Config登録
        </v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            GasProjectに設定したプロパティ名を記入する<br>
            ※スコープごとに振り分ける<br>
            参考
            <v-code class="code">
              {{ keysSample }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            gasのmainにて登録する<br>
            参考:
            <v-code class="code">
              {{ mainSample }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-subheader>
          Config利用
        </v-list-subheader>

        <v-list-item>
          <v-list-item-title>
            <code class="v-code">@l/common/config</code>で利用する<br>
            ※commonにまとめて実装しているが、スコープで分けても良い<br>
            参考:
            <v-code class="code">
              {{ configSample }}
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