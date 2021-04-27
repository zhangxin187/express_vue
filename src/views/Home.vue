<template>
  <div class="home">
    <el-container>
      <el-header style="height:50px">
        <div class="banner">
          <el-row type="flex" justify="space-between" align="middle" style="height: 100%">
            <!-- 网站标题 -->
            <el-col :span="4">
              <p class="title banner_left">
                <i class="iconfont icon-kuaidijindu" style="font-size:28px;font-weight:normal"></i>
                邮政物流管理系统
              </p>
            </el-col>

            <!-- 右边菜单区 -->
            <el-col :span="5" style="height: 100%">
              <div class="banner_right">
                <el-row style="height: 100%" type="flex" justify="space-around">
                  <!-- 设置下拉栏 -->
                  <el-col :span="4" style="height:100%">
                    <div class="seeting drop_li">
                      <el-dropdown trigger="click">
                        <el-button
                          type="info"
                          class="drop_link drop_link_setting"
                          icon="el-icon-setting"
                          style="font-size:22px"
                        ></el-button>
                        <el-dropdown-menu slot="dropdown" style="width:120px">
                          <el-dropdown-item icon="el-icon-user">个人资料</el-dropdown-item>
                          <el-dropdown-item icon="el-icon-switch-button">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </el-col>

                  <!-- 通知下拉栏 -->
                  <el-col :span="4" style="height:100%">
                    <div class="notice drop_li">
                      <el-dropdown trigger="click">
                        <el-button
                          type="warning"
                          class="drop_link drop_link_notice"
                          icon="el-icon-bell"
                          style="font-size:22px"
                        >
                          <!-- bage标记提示 -->
                          <el-badge :value="12" class="notice_bage" is-dot></el-badge>
                        </el-button>

                        <el-dropdown-menu slot="dropdown" style="width:120px">
                          <el-dropdown-item>黄金糕</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </el-col>

                  <!-- 用户下拉栏 -->
                  <el-col :span="16" style="height:100%">
                    <div class="user_menu drop_li">
                      <el-dropdown trigger="click" @command="handleUserCommand">
                        <el-button
                          type="primary"
                          class="drop_link drop_link_user"
                          style="font-size:22px"
                        >
                          <!-- 头像框 -->
                          <el-avatar class="image" icon="el-icon-user-solid" size="large"></el-avatar>
                          <span class="user_info">欢迎使用，张鑫</span>
                          <i class="el-icon-arrow-down user_arrow_down"></i>
                        </el-button>

                        <el-dropdown-menu slot="dropdown" style="width:200px">
                          <el-dropdown-item icon="el-icon-user">个人资料</el-dropdown-item>
                          <el-dropdown-item
                            icon="el-icon-switch-button"
                            divided
                            command="logout"
                          >退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-header>

      <el-container>
        <el-aside :width="asideWidth">
          <!-- 侧边导航栏 -->
          <el-menu background-color="#E6F2FE" :collapse="isCollapse" :collapse-transition="false">
            <el-button class="menu_switch" :icon="aside_menu_switch_icon" @click="collapseMenu"></el-button>
            <!-- 用户/客户管理 -->
            <el-submenu index="1">
              <template slot="title">
                <i class="iconfont icon-yonghu menu-item-icon"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item index="1-1" @click="handleMenuClick('user')">用户列表</el-menu-item>
              <el-menu-item index="1-2" @click="handleMenuClick('customer')">客户列表</el-menu-item>
            </el-submenu>

            <!-- 物品管理 -->
            <el-submenu index="2">
              <template slot="title">
                <i class="iconfont icon-xiangzi menu-item-icon"></i>
                <span>物品管理</span>
              </template>
              <el-menu-item index="2-1" @click="handleMenuClick('category')">分类列表</el-menu-item>
              <el-menu-item index="2-2" @click="handleMenuClick('goods')">物品列表</el-menu-item>
            </el-submenu>

            <!-- 订单管理 -->
            <el-submenu index="3">
              <template slot="title">
                <i class="iconfont icon-icon-test menu-item-icon"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item index="3-1" @click="handleMenuClick('order')">订单列表</el-menu-item>
            </el-submenu>

            <!-- 数据统计 -->
            <el-submenu index="4">
              <template slot="title">
                <i class="iconfont icon-baobiao menu-item-icon"></i>
                <span>数据统计</span>
              </template>
              <el-menu-item index="4-1" @click="handleMenuClick('charts')">数据图表</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main style="padding-top: 10px">
          <!-- 子组件渲染 -->
          <router-view>></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
export default Vue.extend({
  data () {
    return {
      // 控制侧边菜单是否折叠
      isCollapse: false,
      asideWidth: '210px',
      aside_menu_switch_icon: 'el-icon-caret-left',
      // 左侧菜单的数据,对应state.tabPanes存储的数据,用来更新state.tabPanes,控制tab的切换
      menus: null
    };
  },
  methods: {
    // 更新state的mutation方法
    ...mapMutations([
      'changeTabPanes',
      'changeCurrentBreadcrumb',
      'changeActiveTabPane'
    ]),
    // 折叠/显示 侧边菜单栏
    collapseMenu (): void {
      this.isCollapse = !this.isCollapse;
      // 根据侧边菜单折叠状态,相应改变swtich的icon和aside的宽度
      if (!this.isCollapse) {
        this.asideWidth = '210px';
        this.aside_menu_switch_icon = 'el-icon-caret-left';
      } else {
        this.asideWidth = '56px';
        this.aside_menu_switch_icon = 'el-icon-caret-right';
      }
    },

    // 用户下拉框被点击时触发,根据item的key不同做不同响应,el-drowpdown-item无法绑定click事件
    handleUserCommand (key: string): void {
      // 退出登录
      if (key === 'logout') {
        sessionStorage.clear();
        this.$router.push('/login');
      }
    },

    // 响应左侧菜单被点击,在tab中显示对应的组件
    handleMenuClick (key: string) {
      const tabPane = (this.menus as any)[key];
      // 将该菜单对应的数据追加到state.tabPanes数组中,只能通过mutation修改state
      // 此处tabPane被映射为当前组件的计算属性,可以直接用push修改,后续再更新state,将追加后的数组对state进行更新
      this.tabPanes.push(tabPane);
      // 更新state
      this.changeTabPanes(this.tabPanes);
      this.changeCurrentBreadcrumb(tabPane.breadcrumb);
      this.changeActiveTabPane(tabPane.id);
    }
  },
  computed: {
    ...mapState(['tabPanes'])
  },
  async created (): Promise<void> {
    const { data: res } = await (this as any).$axios.get('menus');
    this.menus = res.data;
  }
});
</script>
<style lang="scss" scoped>
.home {
  height: 100%;

  .el-container {
    height: 100%;

    .el-header {
      background-color: #609ed0;
    }
    .el-aside {
      background-color: #e6f2fe;
      height: 100%;
    }
    .el-main {
      background-color: #fff;
      height: 100%;
    }
    .content {
      width: 100%;

      .el-col {
        height: 100%;
      }
    }
  }

  .banner {
    height: 100%;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 24px;
      font-weight: bold;
      font-family: 'Times New Roman', 'SimSun', 'Microsoft YaHei', Arial,
        Verdana, '\5b8b\4f53', myanmar, Zawgyi-One, '蒙语' !important;
    }
    .banner_right {
      background-color: #fff;
      height: 100%;

      .drop_li {
        height: 100%;
        margin-right: 1px;

        .el-dropdown {
          width: 100%;
          height: 100%;

          .drop_link {
            border-radius: 0;
            border: none;
            height: 100%;
            width: 100%;
          }
        }
      }
    }
  }
}

.image {
  position: absolute;
  left: 2%;
  top: 50%;
  transform: translateY(-50%);
}
.user_arrow_down {
  position: absolute;
  right: 3%;
  top: 50%;
  transform: translateY(-50%);
}
.user_info {
  display: inline-block;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  font-size: 14px;
  line-height: 50px;
}
.el-button {
  padding: 0 0;
}

.menu_switch {
  height: 20px;
  width: 100%;
  background-color: rgb(230, 240, 254);
  font-size: 16px;
}
.menu-item-icon {
  font-size: 18px;
  margin-right: 12px;
}

// 消息提示的小圆点
.drop_link_notice {
  position: relative;
  .notice_bage {
    position: absolute;
    top: 5px;
    right: 13px;
  }
}
</style>
