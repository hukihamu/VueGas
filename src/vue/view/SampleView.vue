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
const observeToggle = ref(1)
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <div>{{ sampleText }}</div>
        <v-btn @click="onStart">
          start
        </v-btn>
        <v-btn @click="onStop">
          stop
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>
