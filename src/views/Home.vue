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
            <el-col :span="4" style="height: 100%">
              <div class="banner_right">
                <el-row style="height: 100%" type="flex" justify="space-around">
                  <!-- 用户下拉栏 -->
                  <el-col :span="24" style="height:100%">
                    <div class="user_menu drop_li">
                      <el-dropdown
                        trigger="click"
                        @command="handleUserCommand"
                        placement="bottom-start"
                      >
                        <el-button
                          type="primary"
                          class="drop_link drop_link_user"
                          style="font-size:22px"
                        >
                          <!-- 头像框 -->
                          <el-avatar
                            class="image"
                            :src="userInfo.avatar"
                            icon="el-icon-user-solid"
                            size="large"
                            style="margin-left:10px"
                          ></el-avatar>
                          <span class="user_info">{{ '欢迎使用，' + userInfo.name }}</span>
                          <i class="el-icon-arrow-down user_arrow_down"></i>
                        </el-button>

                        <el-dropdown-menu slot="dropdown" style="width:200px">
                          <el-dropdown-item icon="el-icon-upload">
                            <span @click="showUploadDialog">上传头像</span>
                          </el-dropdown-item>
                          <el-dropdown-item icon="iconfont icon-xiugai">
                            <span @click="eidtPassdialogVisible = true">修改密码</span>
                          </el-dropdown-item>
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

    <!-- 修改密码对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="eidtPassdialogVisible"
      width="40%"
      @close="closeEditPassDialog"
    >
      <el-form
        label-width="80px"
        :model="editPassForm"
        :rules="editPassRules"
        ref="editPassRef"
        status-icon
      >
        <el-form-item label="原密码" prop="orginPass">
          <el-input v-model="editPassForm.orginPass" clearable show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input v-model="editPassForm.newPass" clearable show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="editPassForm.checkPass" clearable show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditPassDialog">取 消</el-button>
        <el-button type="primary" @click="saveEditPass">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 上传头像对话框 -->
    <el-dialog title="上传头像" :visible.sync="uploadDialogVisible" width="40%" @close="closeUploadDialog">
      <el-upload
        action="http://localhost:3000/upload"
        name="file"
        :multiple="false"
        :show-file-list="false"
        class="avatar-uploader"
        :headers="headers"
        :on-success="handleAvatarSuccess"
        :data='{_id:userInfo._id}'
      >
        <img v-if="filePath" :src="filePath" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <i v-if="filePath" class="el-icon-upload hover-avatar-icon"></i>
        <!-- 遮挡层 -->
        <div class="mask"></div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUploadDialog">取 消</el-button>
        <el-button type="primary" @click="closeUploadDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
export default Vue.extend({
  data () {
    // 检测原密码是否输入正确
    const validateOrginPass = async (rule, value, callback) => {
      const { data: res } = await this.$axios.post('login', {
        phone: this.userInfo.phone,
        password: value
      });
      if (res.meta.status === 200) {
        callback();
      } else {
        callback(new Error('密码输入错误'));
      }
    };
    // 密码验证规则
    const validateCheckPass = (rule, value, callback) => {
      if (value !== this.editPassForm.newPass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      // 控制侧边菜单是否折叠
      isCollapse: false,
      asideWidth: '210px',
      aside_menu_switch_icon: 'el-icon-caret-left',
      // 左侧菜单的数据,对应state.tabPanes存储的数据,用来更新state.tabPanes,控制tab的切换
      menus: null,
      // 修改密码对话框显示隐藏
      eidtPassdialogVisible: false,
      // 修改密码对话框的表单
      editPassForm: {
        orginPass: '',
        newPass: '',
        checkPass: ''
      },
      // 修改密码表单验证规则
      editPassRules: {
        orginPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validateOrginPass, trigger: 'blur', required: true }
        ],
        newPass: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        checkPass: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateCheckPass, trigger: 'blur' }
        ]
      },
      // 上传头像对话框显示隐藏
      uploadDialogVisible: false,
      // 文件上传后的服务器资源路径
      filePath: ''
    };
  },
  methods: {
    // 更新state的mutation方法
    ...mapMutations([
      'changeTabPanes',
      'changeCurrentBreadcrumb',
      'changeActiveTabPane',
      'saveUserInfo'
    ]),
    // 折叠/显示 侧边菜单栏
    collapseMenu () {
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
    handleUserCommand (key) {
      // 退出登录
      if (key === 'logout') {
        sessionStorage.clear();
        this.$router.push('/login');
      }
    },

    // 响应左侧菜单被点击,在tab中显示对应的组件
    handleMenuClick (key) {
      const tabPane = this.menus[key];
      // 将该菜单对应的数据追加到state.tabPanes数组中,只能通过mutation修改state
      // 检查该项是否已存在于state中
      const flag = this.tabPanes.some((item) => {
        return item.id === tabPane.id;
      });
      // 当该项不存在时,更新计算属性和state
      if (!flag) {
        // 此处tabPane被映射为当前组件的计算属性,可以直接用push修改,后续再更新state,将追加后的数组对state进行更新
        this.tabPanes.push(tabPane);
        // 更新state
        this.changeTabPanes(this.tabPanes);
        this.changeCurrentBreadcrumb(tabPane.breadcrumb);
        this.changeActiveTabPane(tabPane.id);
      } else {
        // 当该项存在时,让tab显示对应的tabPane,更新state
        this.changeCurrentBreadcrumb(tabPane.breadcrumb);
        this.changeActiveTabPane(tabPane.id);
      }
    },

    // 保存修改密码
    saveEditPass () {
      // 验证
      this.$refs.editPassRef.validate(async (valid) => {
        if (valid) {
          // 验证成功
          const { data: res } = await this.$axios.put(
            'users/' + this.userInfo._id,
            {
              password: this.editPassForm.newPass
            }
          );
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '修改成功,请重新登录',
              duration: 800
            });
            this.eidtPassdialogVisible = false;
            this.$refs.editPassRef.resetFields();
            // 1s后退出登录
            setTimeout(() => {
              sessionStorage.clear();
              this.$router.push('/login');
            }, 1000);
          }
        } else {
          // 验证失败
          this.$message({
            type: 'error',
            message: '修改失败,请重新输入'
          });
        }
      });
    },

    // 关闭修改密码对话框
    closeEditPassDialog () {
      this.eidtPassdialogVisible = false;
      this.$refs.editPassRef.resetFields();
    },

    // 显示上传头像对话框
    async showUploadDialog () {
      // 获取用户信息-头像
      const { data: res } = await this.$axios.get('users/' + this.userInfo._id);
      // es6语法
      this.filePath = res.data?.avatar;
      this.uploadDialogVisible = true;
    },

    // 响应头像上传成功
    handleAvatarSuccess (response) {
      if (response.meta.status === 200) {
        this.filePath = response.data.path;
        // 更新state中的userInfo
        this.saveUserInfo(response.data);
      }
    },

    // 关闭上传头像对话框
    closeUploadDialog () {
      this.uploadDialogVisible = false;
      this.filePath = '';
    }
  },
  computed: {
    ...mapState(['tabPanes', 'userInfo']),
    // 文件上传请求头，文件上传请求不是通过axios,aixos设置了请求拦截器为每个请求头都添加了token,故这里需要自己往请求头中加token
    headers () {
      const token = sessionStorage.getItem('token');
      return { Authorization: token };
    }
  },
  async created () {
    const { data: res } = await this.$axios.get('menus');
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
      padding: 0 1px 0;

      .drop_li {
        height: 100%;

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
.banner_right .el-button {
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

.avatar-uploader-icon {
  font-size: 28px;
  width: 178px;
  height: 178px;
  color: #8c939d;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.hover-avatar-icon{
  position: absolute;
  display: none;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
  font-size: 28px;
}
.mask {
  position: absolute;
  display: none;
  left: 0;
  top: 0;
  width: 178px;
  height: 178px;
  background-color: rgba(0,0,0,.4)
}
</style>
