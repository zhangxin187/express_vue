<template>
  <div class="main">
    <!-- 顶部面包屑导航 -->
    <div class="topNav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{}">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, index) in topNav" :key="index">{{item}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- tabs内容区 -->
    <div class="content" >
      <el-tabs type="border-card" closable  style="height: 100%">
        <el-tab-pane :label="item.label" v-for="item in tabPanes" :key='item.id'>
          <!-- 每个tab-pane下对应一个组件 -->
          <component :is='item.component'></component>
        </el-tab-pane>

      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// import Index from './Index.vue';
import { mapState } from 'vuex';
export default Vue.extend({
  data () {
    return {
      topNav: []
    };
  },
  computed: {
    ...mapState(['tabPanes'])
  },
  created () {
    this.topNav = this.tabPanes[this.tabPanes.length - 1].topNav;
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
</style>
