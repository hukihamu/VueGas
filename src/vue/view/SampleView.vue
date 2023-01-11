<script lang="ts" setup>
import { ref } from 'vue'
import { ControllerTypes } from '@c/controllerTypes'
import { gasClient } from '@v/bin/vue'
import { config } from '@c/bin/common'
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
