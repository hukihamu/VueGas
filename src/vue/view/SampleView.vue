<script lang="ts" setup>
import { ref } from 'vue'
import { ControllerTypes } from '@c/controllerTypes'
import { gasClient } from '@v/bin/vue'
const sampleText = ref('')
gasClient
  .use<ControllerTypes>()
  .send('sample')
  .then(it => {
    sampleText.value = it.text + it.sample
  })
</script>

<template>
  <span>{{ sampleText }}</span>
</template>

<style scoped></style>
