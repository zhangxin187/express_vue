import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tabPanes: [
      { id: 0, component: 'Index', label: '首页', topNav: [] },
      {
        id: 1,
        component: 'User',
        label: '用户列表',
        topNav: ['用户管理', '用户列表']
      }
    ]
  },
  mutations: {},
  actions: {},
  modules: {}
});
