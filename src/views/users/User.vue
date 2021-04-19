<template>
  <div class="users">
    <!-- 操作区域 -->
    <div class="operateArea">
      <el-row :gutter="20">
        <el-col :span="9">
          <div class="search">
            <el-input placeholder="请输入查询内容" clearable v-model="inputValue" @clear="getAllUsers">
              <el-select
                v-model="selectValue"
                slot="prepend"
                placeholder="请选择"
                class="search_slect"
              >
                <el-option label="姓名" value="name"></el-option>
                <el-option label="电话" value="phone"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="querySearch"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="addUserDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 用户列表 -->
    <div class="userTable">
      <el-table :data="users" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="role" label="角色">
          <template v-slot="scope">
            <el-tag v-if="scope.row.role === 'admin'">超级管理员</el-tag>
            <el-tag type="success" v-if="scope.row.role === 'normal'">普通管理员</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="启用状态">
          <!-- 用户状态switch开关 -->
          <template v-slot="scope">
            <!-- 提示文字组件 -->
            <el-tooltip effect="dark" :content="scope.row.status ? '启用' : '禁用'" placement="top">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="changeStatus(scope.row)"
              ></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                round
                @click="showEditUserDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                round
                @click="deleteUser(scope.row._id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="40%"
      @close="closeAddUserDialog"
    >
      <!-- 表单 -->
      <el-form
        ref="addUserRef"
        :model="addUserForm"
        :rules="addUserRules"
        label-width="80px"
        style="width:95%"
        status-icon
      >
        <el-form-item label="名字" prop="name">
          <el-input v-model="addUserForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone" clearable>
          <el-input v-model="addUserForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" clearable>
          <el-input v-model="addUserForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="addUserForm.role" placeholder="请选择">
            <el-option value="normal" label="普通管理员"></el-option>
            <el-option value="admin" label="超级管理员"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="addUserForm.status" :label="1">启用</el-radio>
          <el-radio v-model="addUserForm.status" :label="0">禁用</el-radio>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddUserDialog">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editUserDialogVisible"
      width="40%"
      @close="closeEditUserDialog"
    >
      <!-- 表单 -->
      <el-form
        ref="editUserRef"
        :model="editUserForm"
        :rules="addUserRules"
        label-width="80px"
        style="width:95%"
        status-icon
      >
        <el-form-item label="名字" prop="name">
          <el-input v-model="editUserForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editUserForm.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" clearable style="margin-bottom:0">
          <el-input v-model="editUserForm.password" show-password></el-input>
          <el-link type="primary" :underline="false" @click="resetPassword">重置密码</el-link>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editUserForm.role" placeholder="请选择">
            <el-option value="normal" label="普通管理员"></el-option>
            <el-option value="admin" label="超级管理员"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="editUserForm.status" :label="1">启用</el-radio>
          <el-radio v-model="editUserForm.status" :label="0">禁用</el-radio>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditUserDialog">取 消</el-button>
        <el-button type="primary" @click="saveEditUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Form } from 'node_modules/element-ui/types/element-ui';
import Vue from 'vue';
import { UserData } from '../../types/response';
import _ from 'lodash';
export default Vue.extend({
  data () {
    return {
      users: [],
      // 查询字段
      selectValue: '',
      // 查询参数值
      inputValue: '',
      // 分页相关
      pagenum: 1, // 当前页
      pagesize: 5, // 每页显示数量
      total: 0, // 数据总数
      // 添加用户的对话框显示隐藏状态
      addUserDialogVisible: false,
      // 添加用户的表单数据对象
      addUserForm: {
        name: '',
        phone: '',
        role: 'normal',
        status: 1,
        password: ''
      },
      // 添加用户的表单验证
      addUserRules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确格式的手机号',
            trigger: 'blur'
          }
        ],
        role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度在6-16位', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择用户状态', trigger: 'blur' }
        ]
      },
      // 编辑用户对话框的显示隐藏
      editUserDialogVisible: false,
      // 编辑用户表单数据对象
      editUserForm: {
        name: '',
        password: '',
        phone: '',
        role: 'admin',
        status: 0,
        _id: ''
      },
      // 重置的默认密码
      DEFAULT_PW: '123456'
    };
  },

  methods: {
    // 获取全部用户列表
    async getAllUsers (): Promise<void> {
      const { data: res } = await (this as any).$axios.get('users', {
        params: {
          pagesize: this.pagesize,
          pagenum: this.pagenum
        }
      });
      this.users = res.data.docs;
      this.total = res.data.totalDocs;
    },

    // 更改每页显示数据条数
    handleSizeChange (pagesize: number): void {
      this.pagesize = pagesize;
      // 重新获取用户列表
      this.getAllUsers();
    },

    // 修改当前页,完成翻页
    handleCurrentChange (pagenum: number): void {
      this.pagenum = pagenum;
      // 重新获取当前页
      this.getAllUsers();
    },

    // 根据条件查询用户
    async querySearch (): Promise<void> {
      // 当未选择查询字段或未输入查询内容时,提示错误信息
      if (!this.inputValue.trim() || !this.selectValue.trim()) {
        this.$message({
          message: '请选择查询字段并输入查询内容',
          type: 'error'
        });
      } else {
        // 拼接查询信息
        const queryInfo = { [this.selectValue.trim()]: this.inputValue.trim() };
        // 发起请求
        const { data: res } = await (this as any).$axios.get('users', {
          params: {
            query: queryInfo,
            pagesize: this.pagesize,
            pagenum: this.pagenum
          }
        });
        this.users = res.data.docs;
        this.total = res.data.totalDocs;
      }
    },

    // 更改用户启用状态,防抖
    changeStatus: _.debounce(
      async function (row: UserData) {
        const { _id: id, status } = row;
        // 发起请求,将更改保存到数据库
        const { data: res } = await (this as any).$axios.put(`users/${id}`, {
          status
        });
        if (res.meta.status === 200) {
          this.$message.success('修改成功！');
        }
      },
      1000,
      { leading: true }
    ),

    // 关闭添加用户的对话框
    closeAddUserDialog (): void {
      this.addUserDialogVisible = false;
      // 重置表单
      (this.$refs.addUserRef as Form).resetFields();
    },

    // 添加用户
    addUser (): void {
      // 对表单字段进行验证
      (this.$refs.addUserRef as Form).validate(async (valid) => {
        if (valid) {
          // 验证成功
          const { data: res } = await (this as any).$axios.post(
            'users',
            this.addUserForm
          );
          // 手机号重复
          if (res.meta.status === 401) {
            return this.$message({
              type: 'error',
              message: res.meta.msg
            });
          } else {
            this.$message.success('添加成功！');
            this.getAllUsers();
            // 隐藏对话框
            this.addUserDialogVisible = false;
            // 清空表单
            this.$refs.addUserRef.resetFields();
          }
        } else {
          // 验证失败
          this.$message({
            type: 'error',
            message: '请输入正确格式的数据'
          });
        }
      });
    },

    // 删除用户
    async deleteUser (id: string): Promise<void> {
      const confirm = await this.$confirm('是否删除该用户？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err: any) => err);

      // 发送请求
      if (confirm === 'confirm') {
        const { data: res } = await (this as any).$axios.delete('users/' + id);
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          // 重新请求数据列表
          this.getAllUsers();
        }
      }
    },

    // 显示编辑用户对话框
    async showEditUserDialog (id: string): Promise<void> {
      this.editUserDialogVisible = true;
      // 根据id查询用户信息
      const { data: res } = await (this as any).$axios.get('users/' + id);
      // 将查询到的用户信息合并到editUserForm中去,将用户信息显示到表单中
      (this as any).$_.merge(this.editUserForm, res.data);
    },

    // 编辑用户重置密码
    resetPassword (): void {
      this.editUserForm.password = this.DEFAULT_PW;
      console.log(this.editUserForm);
    },

    // 关闭编辑用户对话框
    closeEditUserDialog (): void {
      this.editUserDialogVisible = false;
      // 清空表单
      (this.$refs.editUserRef as Form).resetFields();
      // 清空密码
      this.editUserForm.password = '';
    },

    // 保存修改的用户信息
    saveEditUser (): void {
      // 对表单字段进行验证
      (this.$refs.editUserRef as Form).validate(async (valid) => {
        if (!valid) {
          // 验证失败
          return this.$message({
            type: 'error',
            message: '请输入正确格式的数据'
          });
        }
        // 验证成功
        // 查看是否输入了密码
        const password = this.editUserForm.password.trim();
        if (!password) {
          // 未输入密码,发送不带密码的修改请求
          const fileds = (this as any).$_.omit(this.editUserForm, [
            '_id',
            'password'
          ]);
          const { data: res } = await (this as any).$axios.put(
            `users/${this.editUserForm._id}`,
            fileds
          );
          if (res.meta.status === 200) {
            // 隐藏对话框
            this.editUserDialogVisible = false;
            this.$message.success('修改成功！');
            // 重新获取数据列表
            this.getAllUsers();
          }
        } else if (password.length < 6 || password.length > 16) {
          // 密码不符合规则
          this.$message({
            type: 'error',
            message: '密码的长度在6-16位'
          });
        } else {
          // 发送带密码的修改请求
          const fileds = (this as any).$_.omit(this.editUserForm, ['_id']);
          const { data: res } = await (this as any).$axios.put(
            `users/${this.editUserForm._id}`,
            fileds
          );
          if (res.meta.status === 200) {
            // 隐藏对话框
            this.editUserDialogVisible = false;
            this.$message.success('修改成功！');
          }
        }
      });
    }
  },

  created (): void {
    // 获取全部用户列表
    this.getAllUsers();
  }
});
</script>
<style lang="scss" scoped>
.search {
  display: flex;
}
.userTable {
  margin-top: 10px;
}
.search_slect {
  width: 95px;
}
</style>
