import { initVue } from '@v/bin/vue'
import SampleView from '@v/view/SampleView.vue'

initVue([
  {
    path: '/',
    name: 'sample',
    component: SampleView,
  },
])
