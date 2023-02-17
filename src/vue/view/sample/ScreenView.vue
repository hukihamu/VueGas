<script lang="ts" setup>
import {} from 'vue'
const sample = `
&lt;script lang="ts" setup>
import {} from 'vue'
const mainSample = \`
initVue([
  /*省略*/
], {blueprint: md3})
\`
const useRouteSample = \`
/*省略*/
\`
&lt;/script>

<template>
  <v-card>
    <v-card-title>ルーティング</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            <code class="v-code">src\\vue\\main.ts</code>内<code class="v-code">initVue</code>の第一引数にルーティングの設定を記述する<br>
            参考:
            <v-code class="code">
              {{ mainSample }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            ルーティングの利用は<code class="v-code">@l/vue/router</code>で行う<br>
            参考:
            <v-code class="code">
              {{ useRouteSample }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            詳細はVueのリファレンスを参照:
            <a target="_blank" href="https://router.vuejs.org/guide/">https://router.vuejs.org/guide/</a>
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
`.replaceAll('&lt;', '<')
</script>

<template>
  <v-card>
    <v-card-title>画面の作成</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            スクリプトの記入は<code class="v-code">&lt;script lang="ts" setup&gt;&lt;/script&gt;</code>内で行う
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            詳細はVueのリファレンスを参照:
            <a target="_blank" href="https://ja.vuejs.org/api/sfc-script-setup.html">
              https://ja.vuejs.org/api/sfc-script-setup.html
            </a>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            Vuetifyのタグ利用はリファレンス参照:
            <a target="_blank" href="https://vuetifyjs.com/en/features/application-layout/">
              https://vuetifyjs.com/en/features/application-layout/
            </a>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            参考(ルーティングサンプル画面):
            <v-code class="code">
              {{ sample }}
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