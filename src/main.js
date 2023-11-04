import Vue from 'vue'

import '@/plugins/index.js'

import App from './App'
import store from './store'
import router from './router'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
