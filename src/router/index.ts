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
router.beforeEach((to, from, next) => {
  // to:将要访问的路径
  // from:从哪个路径过来
  // next是一个函数,代表放行; next():放行   next('/login'):强制跳转到login路由
  // 当访问登陆页面,则放行
  if (to.path === '/login') return next();
  // 判断是否登陆,即查看sessionStorage中是否存储有userInfo字段,登录成功会往vuex得state存储userInfo,state又会进行持久化
  // vuex持久化是存储到sessionStorage中,故需要从中解析出userInfo
  const userInfo = JSON.parse(sessionStorage.getItem('vuex') as string)
    ?.userInfo;
  // 未登录,没有userInfo,强制跳转到登陆路由的页面
  if (!userInfo) return next('/login');
  // 登陆了,放行
  next();
});

export default router;
