<script lang="ts" setup>
import {} from 'vue'
const throwSample = `export const spreadsheetId = getConfig.gas('spreadsheetId') ?? throwMsg('spreadsheetIdがコンテンツプロパティに設定されていません')`
</script>

<template>
  <v-card>
    <v-card-title>その他便利機能</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-subheader>
          Logger
        </v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            gasは<code class="v-code">gLogger</code>、vueは<code class="v-code">vLogger</code>を利用可能<br>
            configに<code class="v-code">debug</code>を設定することで、logger.debugを利用可能となる
          </v-list-item-title>
        </v-list-item>
        <v-list-subheader>
          throwMsg
        </v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            例外処理を1行で書ける
            <v-code>
              {{ throwSample }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-subheader>
          gasService
        </v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            <code class="v-code">gasService</code>内に、Gasで提供されているサービスを利用できる<br>
            <a href="https://developers.google.com/apps-script/reference/base/session">session</a><br>
            <a href="https://developers.google.com/apps-script/reference/utilities/utilities">utilities</a><br>
            <a href="https://developers.google.com/apps-script/reference/url-fetch">fetch</a>
          </v-list-item-title>
        </v-list-item>
        <v-list-subheader>
          Vueプラグイン
        </v-list-subheader>
        <v-list-item>
          <a href="https://vuetifyjs.com/en/">Vuetify</a>
        </v-list-item>
        <v-list-item>
          <a href="https://pinia.vuejs.org/">Pinia</a>
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