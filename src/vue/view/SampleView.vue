<script lang="ts" setup>
import { ref } from 'vue'
import { ControllerTypes } from '@c/controllerTypes'
import { gasClient } from '@l/vue'
import { config } from '@l/common'
import { VConfig } from '@v/vConfig'
const sampleText = ref('')
gasClient
  .use<ControllerTypes>()
  .send('sample')
  .then(it => {
    sampleText.value = it.text + it.sample + config<VConfig>().vue('vueConfig')
  })
</script>

<template>
  <span>{{ sampleText }}</span>
</template>

<style scoped></style>
