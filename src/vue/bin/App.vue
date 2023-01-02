<script lang="ts" setup>
import { router } from '@v/bin/vue'
router.afterEach(route => {
  window.google.script.history.replace(undefined, route.query, route.path)
})
window.google.script.url.getLocation(location => {
  const path = location.hash ? location.hash : '/'
  const query = location.parameter
  router.replace({ path, query })
})
</script>
<template>
  <router-view />
</template>
<style scoped></style>
