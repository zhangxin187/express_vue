import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element';
import './assets/css/common.scss';
import axios from 'axios';
// 导入进度条插件
import NProgress from 'nprogress';
// 导入进度条样式
import 'nprogress/nprogress.css';
// 导入lodash
import _ from 'lodash';

// 导入自定义全局组件
import Index from './views/Index.vue';
import User from './views/users/User.vue';
import Category from './views/goods/Category.vue';
// 注册自定义全局组件
Vue.component('Index', Index);
Vue.component('User', User);
Vue.component('Category', Category);

Vue.prototype.$_ = _;
Vue.prototype.$axios = axios;

// 配置axios
axios.defaults.baseURL = 'http://localhost:3000/';
// axios请求拦截器
axios.interceptors.request.use(config => {
  // 显示进度条,当发起请求时，显示进度条
  NProgress.start();
  // 后台要求访问需要授权的接口，请求头必须含有Auhorization字段，其值必须为token
  config.headers.Authorization = sessionStorage.getItem('token');
  return config;
});
// axios响应拦截器
axios.interceptors.response.use(config => {
  // 结束进度条
  NProgress.done();
  return config;
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
