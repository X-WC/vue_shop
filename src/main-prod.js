// 入口文件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'

// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式
import './assets/css/global.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 在全局情况下 绑定富文本编辑器
Vue.use(VueQuillEditor)

Vue.prototype.$http = axios
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

// 创建过滤器将秒数过滤为年月日 时分秒
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  // 获取年月日
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  // 获取时分秒
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
