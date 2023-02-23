import { initVue } from '@l/vue'
import RootView from '@v/view/RootView.vue'
import IndexView from '@v/view/IndexView.vue'
import BuildRunView from '@v/view/sample/BuildRunView.vue'
import ScreenView from '@v/view/sample/ScreenView.vue'
import RoutingView from '@v/view/sample/RoutingView.vue'
import ControllerView from '@v/view/sample/ControllerView.vue'
import ObserverView from '@v/view/sample/ObserverView.vue'
import ConfigView from '@v/view/sample/ConfigView.vue'
import SpreadsheetView from '@v/view/sample/SpreadsheetView.vue'
import OtherView from '@v/view/sample/OtherView.vue'

import { md3 } from 'vuetify/blueprints'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import 'vuetify/styles'
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
      },
      {
        path: 'sample-screen',
        component: ScreenView
      },
      {
        path: 'sample-router',
        component: RoutingView
      },
      {
        path: 'sample-controller',
        component: ControllerView
      },
      {
        path: 'sample-observer',
        component: ObserverView
      },
      {
        path: 'sample-config',
        component: ConfigView
      },
      {
        path: 'sample-spreadsheet',
        component: SpreadsheetView
      },
      {
        path: 'sample-other',
        component: OtherView
      }
    ]
  }
],
  {
    blueprint: md3,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {mdi}
    }
  })

