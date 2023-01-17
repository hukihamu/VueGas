<script lang="ts" setup>
import { ref } from 'vue'
import { ControllerTypes } from '@c/controllerTypes'
import { gasClient } from '@l/vue'
import { config } from '@l/common'
import { ConfigType } from '@c/config'
import { ObserverType } from '@c/observerType'
const sampleText = ref('')
gasClient
  .controller<ControllerTypes>()
  .send('sample')
  .then(it => {
    sampleText.value = it.text + it.sample + config.vue<ConfigType>('vueConfig')
  })
const observeText = ref<string | undefined>('')
const onStart = () => {
  gasClient.observer<ObserverType>().observe('sampleObserver', { intervalMSec: 100, text: 'lastUpdate: ' }, observeText)
}
const onStop = () => {
  gasClient.observer<ObserverType>().stop('sampleObserver')
}
</script>

<template>
  <span>{{ sampleText }}</span>
  <div>
    <button @click="onStart">start</button>
    <span>{{ observeText }}</span>
    <button @click="onStop">stop</button>
  </div>
</template>

<style scoped></style>
