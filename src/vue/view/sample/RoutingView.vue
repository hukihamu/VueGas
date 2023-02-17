<script lang="ts" setup>
import {} from 'vue'
const mainSample = `
initVue([
  {
    path: '/',
    // RootView上にVuetifyのレイアウトの設定・router-viewを設置
    component: RootView,
    redirect: '/index',
    // RootViewからvuetifyのレイアウトを利用するために、childrenを活用
    children: [
      {
        path: 'index',
        component: IndexView
      },
      {
        path: 'sample-router',
        component: RoutingView
      },
      /*省略*/
    ]
  },
], {blueprint: md3})
`
const useRouteSample = `
import { router } from '@l/vue'
// 差し替え
router.replace('/sample-router')
// 移動
router.push('/sample-router')
// 戻る
router.back()
`
</script>

<template>
  <v-card>
    <v-card-title>ルーティング</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            ルーティングのパスはURLの末尾<code class="v-code">#</code>の後ろに記述される
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <code class="v-code">src\vue\main.ts</code>内<code class="v-code">initVue</code>の第一引数にルーティングの設定を記述する<br>
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