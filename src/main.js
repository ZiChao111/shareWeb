import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import Axios from 'axios'
import './assets/CSS/global.css'
import "@/assets/iconfont/iconfont.css"

Axios.defaults.baseURL = 'http://114.116.237.82:8080'
// 配置拦截器
Axios.interceptors.request.use(config => {
  config.headers.accesstoken = window.sessionStorage.getItem('token')
  return config
})
Axios.defaults.withCredentials = false;
Vue.prototype.$axios = Axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
