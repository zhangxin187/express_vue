<template>
  <div class="login_main">
    <el-row class="title" type="flex" justify="center">
      <el-col :span="6">
        <p>邮政电商物流管理系统</p>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="8">
        <el-card class="box-card" shadow="hover">
          <el-form ref="loginForm" :model="form" :rules="rules" status-icon>
            <el-form-item prop="phone">
              <el-input
                v-model="form.phone"
                prefix-icon="el-icon-user"
                placeholder="请输入账号"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                prefix-icon="el-icon-lock"
                placeholder="请输入密码"
                clearable
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="loginBtn" @click="handleLogin"
                >登录</el-button
              >
            </el-form-item>
            <!-- <el-form-item>
              <el-link
                type="primary"
                :underline="false"
                @click="findPassDialogVisible = true"
                >忘记密码？</el-link
              >
            </el-form-item> -->
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <!-- 找回密码对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Form } from 'node_modules/element-ui/types';
import { ErrorMessage } from '../types/login';
import Vue from 'vue';
import { AxiosResponse } from 'node_modules/axios';
import { ResponseData, LoginData } from '../types/response';
import { mapMutations } from 'vuex';
export default Vue.extend({
  data () {
    return {
      form: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确格式的手机号',
            trigger: 'blur'
          }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      // 找回密码对话框显示隐藏
      findPassDialogVisible: false
    };
  },
  methods: {
    // 登录按钮点击处理逻辑
    handleLogin (): void {
      (this.$refs.loginForm as Form).validate(async (valid, err) => {
        if (valid) {
          // 发起请求,axios挂载到vue上 在该处获取不到，ts报错，故加any
          const data: AxiosResponse = await (this as any).$axios.post(
            'login',
            this.form
          );
          const res: ResponseData = data.data;

          if (res.meta.status !== 200) {
            this.$message({
              type: 'error',
              message: '账号或密码错误',
              duration: 1500
            });
          } else {
            // 登录成功
            // 存储token
            sessionStorage.setItem('token', (res.data as LoginData).token);
            this.$refs.loginForm.resetFields();
            // 剔除用户信息中敏感字段并存储到state中
            const user = this.$_.omit(res.data, ['password', 'token']);
            this.saveUserInfo(user);

            // 增加一个loading状态
            const loadingInstance = this.$Loading.service({
              target: 'box-card',
              text: 'Loading',
              spinner: 'el-icon-loading'
            });
            // 300ms后关闭loading等待状态
            setTimeout(() => {
              loadingInstance.close();
              // 跳转到首页
              this.$router.push('home');
            }, 300);
          }
        } else {
          // 只输出第一条错误信息即可
          const info = Object.keys(err)[0];
          const mesaage = (err as ErrorMessage)[info][0].message;
          this.$message({
            showClose: true,
            message: mesaage,
            type: 'error'
          });
        }
      });
    },

    // state中的方法
    ...mapMutations(['saveUserInfo'])
  }
});
</script>

<style lang="scss" scoped>
.login_main {
  height: 100%;
  background-color: #81aad9;
  background-image: url('../assets/images/loginBg1.jpg');
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .box-card {
    height: 300px;
    margin: auto;
    transform: translateY(100px);
  }
  .loginBtn {
    width: 100%;
  }
  .el-link {
    position: absolute;
    right: 10px;
    top: -20px;
  }
  .el-form {
    margin-top: 30px;
  }
  .title {
    p {
      font-size: 36px;
      line-height: 46px;
      font-family: '微软雅黑';
      color: #fff;
      margin-top: 10px;
    }
  }
}
</style>

function await(arg0: any) { throw new Error('Function not implemented.'); }
