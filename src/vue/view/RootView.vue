<script lang="ts" setup>
import {} from 'vue'
import SideBar from '@v/components/SideBar.vue'

</script>

<template>
  <v-layout>
    <v-navigation-drawer>
      <SideBar />
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>

<style scoped>

</style>