import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Main from '../views/Main.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/main',
    children: [{ path: '/main', component: Main }]
  }
];

const router = new VueRouter({
  routes
});

// 添加路由导航守卫
// router.beforeEach((to, from, next) => {
//   // to:将要访问的路径
//   // from:从哪个路径过来
//   // next是一个函数,代表放行; next():放行   next('/login'):强制跳转到login路由
//   // 当访问登陆页面,则放行
//   if (to.path === '/login') return next();
//   // 判断是否登陆,即查看sessionStorage中是否存储有token
//   // bug：客户端可以伪造token,绕过这个检查,最好向接口请求一下，验证该token是否与服务器存储的一样
//   // var token = sessionStorage.getItem('token');
//   // // 未登录,没有token,强制跳转到登陆路由的页面
//   // if (!token) return next('/login');
//   // // 登陆了,放行
//   // next();
// });

export default router;
