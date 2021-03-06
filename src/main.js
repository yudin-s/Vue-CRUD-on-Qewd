import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/css/sb-admin-2.css'
import CrudRegistry from '@/schema/schema_register'
import io from 'socket.io-client'
import { QEWD, VueQEWD } from 'vue-qewd'
import buildQewdVuex from '@/store/qewd_store'
// import both the QEWD class and VueQEWD plugin
// import axios (optional, in case you need to use ajax mode)
import VueCookies from 'vue-cookies'
router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next()
  }
  const middleware = to.meta.middleware
  const context = {
    to,
    from,
    next,
    store
  }
  return middleware[0]({
    ...context
  })
})

Vue.config.productionTip = false

// instantiate QEWD with your parameters
var qewd = QEWD({
  application: 'pt-wc-q', // application name
  log: true,
  url: 'http://localhost:8090', // adjust this to your local environment
  io, // use WebSocket communication
  mode: 'development',
  cookieName: 'ewdSession'
})

// let Vue know you want to use the plugin
Vue.use(VueQEWD, { qewd })
Vue.use(VueCookies)

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

for (const crudRegistryKey in CrudRegistry) {
  const crudItm = CrudRegistry[crudRegistryKey]
  store.registerModule(crudItm.name, buildQewdVuex(qewd, crudItm))
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
