import { initVue } from '@l/vue'
import SampleView from '@v/view/SampleView.vue'

initVue([
  {
    path: '/',
    name: 'sample',
    component: SampleView,
  },
])
