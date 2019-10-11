import Vue from 'vue'
import App from './App'
import store from './store/index'
import commonJs from './assets/js/common'
import Api from './api/api'
import configData from './config/index'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$server = Api
Vue.prototype.$CommonJs = commonJs
Vue.prototype.$ConfigData = configData
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
