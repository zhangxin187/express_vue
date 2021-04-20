<template>
  <div class="customer">
    <!-- 操作区域 -->
    <div class="operateArea">
      <el-row :gutter="20">
        <el-col :span="9">
          <div class="search">
            <el-input
              placeholder="请输入查询内容"
              clearable
              v-model.trim="searchValue"
              @clear="getCustomers"
              @keyup.enter.native="querySearch"
              @change="querySearch"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="querySearch"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="addCustomerDialogVisible = true"
            >添加客户</el-button
          >
        </el-col>
      </el-row>
    </div>

    <!-- 客户列表 -->
    <div class="customerTable">
      <el-table :data="customerList" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="名字"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="address" label="地址">
          <template v-slot="scope">
            <!-- 将数组处理为字符串 -->
            <span>{{ scope.row.address.join('') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                round
                @click="showEditCustomerDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                round
                @click="deleteCustomer(scope.row._id)"
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
      :page-sizes="[5, 10, 15]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加客户的对话框 -->
    <el-dialog
      title="添加客户"
      :visible.sync="addCustomerDialogVisible"
      width="40%"
      @close="closeAddCustomerDialog"
    >
      <!-- 表单 -->
      <el-form
        ref="addCustomerRef"
        :model="addCustomerForm"
        :rules="rules"
        label-width="90px"
        style="width:95%"
        status-icon
      >
        <el-form-item label="客户名" prop="name">
          <el-input v-model="addCustomerForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addCustomerForm.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="省市区/县" prop="selectValue">
          <el-cascader
            :options="option"
            v-model="addCustomerForm.selectValue"
            clearable
            :props="cascaderProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input
            v-model="addCustomerForm.detailAddress"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddCustomerDialog">取 消</el-button>
        <el-button type="primary" @click="saveAddCustomer">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改客户的对话框 -->
    <el-dialog
      title="修改客户"
      :visible.sync="editCustomerDialogVisible"
      width="40%"
    >
      <!-- 表单 -->
      <el-form
        ref="editCustomerRef"
        :model="editCustomerForm"
        :rules="rules"
        label-width="90px"
        style="width:95%"
        status-icon
      >
        <el-form-item label="客户名" prop="name">
          <el-input v-model="editCustomerForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editCustomerForm.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="省市区/县" prop="selectValue">
          <el-cascader
            :options="option"
            v-model="editCustomerForm.selectValue"
            clearable
            :props="cascaderProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input
            v-model="editCustomerForm.detailAddress"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary" @click="saveEditCustomer">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { regionData } from 'element-china-area-data';
export default {
  data () {
    return {
      // 客户列表
      customerList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      // 查询参数
      searchValue: '',
      // 控制添加客户对话框显示隐藏
      addCustomerDialogVisible: false,
      addCustomerForm: {
        name: '',
        phone: '',
        detailAddress: '',
        // 级联选择器选择的值
        selectValue: []
      },
      // 级联选择器绑定的数据
      option: regionData,
      // 级联选择器配置
      cascaderProps: {
        children: 'children',
        expandTrigger: 'hover',
        value: 'label'
      },
      rules: {
        name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确格式的手机号',
            trigger: 'blur'
          }
        ],
        selectValue: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        detailAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      editCustomerForm: {},
      editCustomerDialogVisible: false
    };
  },

  methods: {
    // 获取商品列表
    async getCustomers () {
      const { data: res } = await this.$axios.get('customers', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      this.customerList = res.data.docs;
      this.total = res.data.totalDocs;
    },

    // 更改每页显示数据条数
    handleSizeChange (pagesize) {
      this.pagesize = pagesize;
      this.getCustomers();
    },

    // 当前页发生变化,实现跳转页码
    handleCurrentChange (pagenum) {
      this.pagenum = pagenum;
      this.getCustomers();
    },

    // 根据输入内容查询商品
    async querySearch () {
      // 判断查询关键字是数字还是字符串,数字则查询字段为phone,否则为name
      // 由于selectValue的类型是字符串,故将其进行转换为数字,数字字符串会被转为数字,非数字字符串会被转为NaN
      // 判断转换后的值是不是NaN 就能区分开 数字字符串 和 非数字字符串
      // typeof NaN 等于 'number'  NaN不等于NaN
      const key = isNaN(+this.searchValue) ? 'name' : 'phone';

      const { data: res } = await this.$axios.get('customers', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          [key]: this.searchValue // 对象计算属性
        }
      });
      this.customerList = res.data.docs;
      this.total = res.data.totalDocs;
    },

    // 保存添加客户
    async saveAddCustomer () {
      // 对表单字段进行验证
      this.$refs.addCustomerRef.validate(async valid => {
        if (valid) {
          // 验证成功
          const cloneForm = this.$_.cloneDeep(this.addCustomerForm);
          const { selectValue, detailAddress } = cloneForm;
          const form = this.$_.omit(cloneForm, [
            'selectValue',
            'detailAddress'
          ]);
          // 将省市区和详细地址放到一个数组
          selectValue.push(detailAddress);
          form.address = selectValue;
          const { data: res } = await this.$axios.post('customers', form);
          if (res.meta.status === 200) {
            this.$message.success('添加成功');
            this.addCustomerDialogVisible = false;
            // 重置表单
            this.$refs.addCustomerRef.resetFields();
            this.getCustomers();
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

    // 关闭添加用户对话框
    closeAddCustomerDialog () {
      this.addCustomerDialogVisible = false;
      this.$refs.addCustomerRef.resetFields();
    },

    // 删除客户
    async deleteCustomer (id) {
      const confirm = await this.$confirm('是否删除该客户？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (confirm === 'confirm') {
        const { data: res } = await this.$axios.delete('customers/' + id);
        if (res.meta.status === 200) {
          this.$message.success('删除成功');
          // 重新获取数据
          this.getCustomers();
        }
      }
    },

    // 展示编辑用户对话框
    showEditCustomerDialog (row) {
      const cloneForm = this.$_.cloneDeep(row);
      // 将address 分为省市区和详细地址两个数组,与添加用户对address的处理是相反操作
      const { address } = cloneForm;
      const detailAddress = address.pop();
      const form = this.$_.omit(cloneForm, 'address');
      form.detailAddress = detailAddress;
      form.selectValue = address;
      this.editCustomerForm = form;
      this.editCustomerDialogVisible = true;
    },

    async  saveEditCustomer () {
      const cloneForm = this.$_.cloneDeep(this.editCustomerForm);
      const { selectValue, detailAddress } = cloneForm;
      const form = this.$_.omit(cloneForm, ['selectValue', 'detailAddress']);
      // 将省市区和详细地址合并为一个数组
      selectValue.push(detailAddress);
      form.address = selectValue;
      const { data: res } = await this.$axios.put(`customers/${form._id}`, form);
      if (res.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '修改成功！',
          duration: 1000
        });
        this.editCustomerDialogVisible = false;
        this.getCustomers();
      }
    }
  },

  created () {
    this.getCustomers();
  }
};
</script>

<style lang="scss" scoped>
.customerTable {
  margin-top: 10px;
}
.el-cascader {
  width: 100%;
}
</style>
