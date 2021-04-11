import Vue from 'vue';
import Vuex from 'vuex';
// 状态持久化插件
import persistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  // 持久化插件,将state存储在sessionStorage中,避免页面刷新state变为初始值
  plugins: [persistedState({ storage: window.sessionStorage })],
  state: {
    // Main.vue中每个tabpane下对应一个组件
    tabPanes: [{ id: 0, component: 'Index', label: '首页', breadcrumb: [] }],
    // 对应tabpane的面包屑导航
    currentBreadcrumb: [],
    // 当前选中的tabpane,值为id
    activeTabPane: '0'
  },
  mutations: {
    changeTabPanes (state, tabPanes) {
      state.tabPanes = tabPanes;
    },
    changeCurrentBreadcrumb (state, breadcrumb) {
      state.currentBreadcrumb = breadcrumb;
    },
    changeActiveTabPane (state, tabPaneId) {
      // tabPane的name要求为字符串
      state.activeTabPane = tabPaneId + '';
    }
  },
  actions: {},
  modules: {}
});
