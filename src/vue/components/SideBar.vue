<script lang="ts" setup>
import {ref} from 'vue'

const items = [
  { title: 'トップ', to: '/index' },
  { title: 'ビルド・接続', to: '/build-run' },
  { title: '画面の作成', to: '/sample-screen' },
  { title: 'ルーティング', to: '/sample-router' },
  {
    title: 'GASと通信', value: 'g', items:
      [
        { title: 'Controller', to: '/sample-controller' },
        { title: 'Observer', to: '/sample-observer' }
      ]
  },
  { title: 'スクリプトプロパティ利用', to: '/sample-config' },
  { title: 'Spreadsheetを利用', to: '/sample-spreadsheet' },
  { title: 'その他便利機能', to: '/sample-other' }
]
const opened = ref(['g'])
</script>

<template>
  <v-list v-model:opened="opened">
    <template v-for="(item) in items">
      <v-list-item v-if="!item.items"
                   :key="item.title"
                   :to="item.to"
                   :title="item.title" />
      <v-list-group v-else
                    :key="item.title"
                    value="item.value">
        <template #activator="{ props }">
          <v-list-item :title="item.title"
                       v-bind="props" />
        </template>
        <v-list-item v-for="(it) in item.items"
                     :key="it.title"
                     :title="it.title"
                     :to="it.to"
                     color="primary" />
      </v-list-group>
    </template>
  </v-list>
</template>

<style scoped>

</style>