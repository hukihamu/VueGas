<script lang="ts" setup>
import {} from 'vue'

const items = [
  {title: 'トップ', to: '/index'},
  {title: 'ビルド・接続', to: '/build-run'},
  {title: '画面の作成', to: '/sample-screen'},
  {title: 'ルーティング', to: '/sample-router'},
  {title: 'GASと通信', to: '/sample-gas-connect'},
]
</script>

<template>
  <v-list>
    <v-list-item
      v-for="item in items"
      :key="item.title"
      :title="item.title"
      :to="item.to"
      color="primary"
    />
  </v-list>
</template>

<style scoped>

</style>