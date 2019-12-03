import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible'
import '@/assets/css/reset.css';
import http  from './http'
import wx from "weixin-jsapi";



import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)
Vue.prototype.$http = http;

Vue.config.productionTip = false

import Moment from "moment";
Vue.filter('dateFormat', function (str, pattern = 'YYYY-MM-DD') {
   return Moment(str).format(pattern)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
