import { initVue } from '@l/vue'
import RootView from '@v/view/RootView.vue'
import { md3 } from 'vuetify/blueprints'
import IndexView from '@v/view/IndexView.vue'
import BuildRunView from '@v/view/sample/BuildRunView.vue'

initVue([
  {
    path: '/',
    component: RootView,
    redirect: '/index',
    // RootViewからvuetifyのレイアウトを利用するために、childrenを活用
    children: [
      {
        path: 'index',
        component: IndexView
      },

      {
        path: 'build-run',
        component: BuildRunView
      }
    ]
  },
], {blueprint: md3})
