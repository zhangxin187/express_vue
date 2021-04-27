<template>
  <div class="main">
    <!-- 顶部面包屑导航 -->
    <div class="topNav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{}">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, index) in currentBreadcrumb" :key="index">{{ item }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- tabs内容区 -->
    <div class="content">
      <el-tabs
        type="border-card"
        closable
        :value="activeTabPane"
        @tab-click="handleTabClick"
        @tab-remove="removeTab"
      >
        <el-tab-pane
          :label="item.label"
          v-for="item in tabPanes"
          :key="item.id"
          :name="item.id + ''"
        >
          <!-- 每个tab-pane下对应一个组件 -->
          <component :is="item.component"></component>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { TabPane } from 'node_modules/element-ui/types/element-ui';
import Vue from 'vue';
// import Index from './Index.vue';
import { mapState, mapMutations } from 'vuex';
export default Vue.extend({
  data () {
    return {};
  },
  computed: {
    ...mapState(['tabPanes', 'currentBreadcrumb', 'activeTabPane'])
  },
  methods: {
    // mutation
    ...mapMutations([
      'changeTabPanes',
      'changeCurrentBreadcrumb',
      'changeActiveTabPane'
    ]),

    // 响应tabPane点击事件
    handleTabClick (tab: TabPane): void {
      // tab.name被点击的tabPane的name值,就是state中tabPanes的id值
      // 根据id从tabPanes中取出其对应的breadcrumb,修改currentBreadcrumb
      const tabPane = this.tabPanes.find((value: any, index: number) => {
        return value.id === +tab.name;
      });

      // 更新state
      this.changeCurrentBreadcrumb(tabPane.breadcrumb);
      this.changeActiveTabPane(tabPane.id);
    },

    // 删除tab
    removeTab (tabName: any): void {
      // 根据tabName(id)查找到state.tanPanes中对应的索引,并删除掉
      const index = this.tabPanes.findIndex((item: any, index: number) => {
        return item.id === +tabName;
      });
      this.tabPanes.splice(index, 1);

      // 更新state
      // 此处有bug,后期再解决
      // 1.删除非当前tab  2.删除的tab是第一个
      this.changeTabPanes(this.tabPanes);
      // 让前一个tabPane选中,并更新其对应的面包屑
      const activeTabPne = this.tabPanes[index - 1];
      this.changeCurrentBreadcrumb(activeTabPne.breadcrumb);
      this.changeActiveTabPane(activeTabPne.id);
    }
  }
});
</script>
<style lang="scss" scoped>
.main {
  height: 100%;
}
.content {
  margin-top: 12px;
  height: 100%;
}
.homePage {
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  color: #303133;
}
.topNav{
}

</style>
