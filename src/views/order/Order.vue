<template>
  <div class="order">
    <!-- 操作区 -->
    <el-row :gutter="20">
      <el-col :span="9">
        <div class="search">
          <el-input
            placeholder="请输入订单编号"
            clearable
            v-model.trim="searchValue"
            @clear="getOrders"
            @keyup.enter.native="querySearch"
            @change="querySearch"
          >
            <el-button slot="append" icon="el-icon-search" @click="querySearch"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" @click="addOrderDialogVisible = true">录入订单</el-button>
      </el-col>
    </el-row>
    <!-- 订单列表 -->
    <div class="ordersTable">
      <el-table :data="orderList" stripe border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="寄件地址 :">
                <span>{{ scope.row.sender.address.join('') }}</span>
              </el-form-item>
              <el-form-item label="收货地址 :">
                <span>{{ scope.row.arrive_Address.join('')}}</span>
              </el-form-item>
              <el-form-item label="寄件人 :">
                <span>{{ scope.row.sender.name}}</span>
              </el-form-item>
              <el-form-item label="联系方式 :">
                <span>{{ scope.row.sender.phone}}</span>
              </el-form-item>
              <el-form-item label="下单时间 :">
                <span>{{ dateFormat(scope.row.createTime)}}</span>
              </el-form-item>
              <el-form-item label="送达时间 :">
                <span>{{ scope.row.arriveTime ? dateFormat(scope.row.arriveTime): '未送达'}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="order_No" label="订单编号"></el-table-column>
        <el-table-column prop="goods" label="物品">
          <template v-slot="scope">
            <span>{{scope.row.goods && scope.row.goods.goods_Name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(kg)"></el-table-column>
        <el-table-column label="是否送达" prop="isArrive">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.isArrive" effect="dark">是</el-tag>
            <el-tag type="danger" v-else effect="dark">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="createTime">
          <template v-slot="scope">
            <span>{{dateFormat(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="寄件人" prop="sender">
          <template v-slot="scope">
            <!-- 访问对象下不存在的属性会报错,所以要使用对象下属性时一定要进行判断 -->
            <span>{{scope.row.sender && scope.row.sender.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :width="200">
          <template v-slot="scope">
            <el-tooltip effect="dark" content="确认送达" placement="top">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-circle-check"
                @click="showCheckArriveDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改收货地址" placement="top">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="showEditAddressDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteOrder(scope.row._id)"
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

    <!-- 确认送达操作对话框 -->
    <el-dialog :visible.sync="checkArriveDialogVisible" width="40%" @close="closeCheckArriveDialog">
      <span style="margin-right:15px">送达日期</span>
      <el-date-picker
        style="width:60%"
        time-arrow-control
        v-model="arriveTime"
        type="datetime"
        placeholder="选择日期时间"
      ></el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCheckArriveDialog">取 消</el-button>
        <el-button type="primary" @click="saveCheckArrive">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改收货地址对话框 -->
    <el-dialog
      :visible.sync="editAddressDialogVisible"
      title="修改收货地址"
      width="40%"
      @close="closeEditAddressDialog"
    >
      <el-form ref="editAddressRef" label-width="90px" style="width:95%" status-icon>
        <el-form-item label="省市区/县">
          <el-cascader :options="option" v-model="selectAddress" clearable :props="cascaderProps"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="detailAddress" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditAddressDialog">取 消</el-button>
        <el-button type="primary" @click="saveEditAddress">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 录入订单的对话框 -->
    <el-dialog
      :visible.sync="addOrderDialogVisible"
      title="添加订单"
      width="40%"
      @close="closeAddOrderDialog"
    >
      <el-form
        ref="addOrderRef"
        :model="addOrderForm"
        :rules="addOrderRules"
        label-width="90px"
        style="width:95%"
        status-icon
      >
        <el-form-item label="订单编号" prop="order_No">
          <el-input v-model="addOrderForm.order_No" clearable></el-input>
        </el-form-item>
        <el-form-item label="寄件人" prop="sender">
          <el-select v-model="addOrderForm.sender" placeholder="请选择" filterable style="width:100%">
            <el-option
              v-for="item in customerList"
              :key="item._id"
              :label="item.name+' - '+item.phone+' - '+item.address.join('')"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货品" prop="goods">
          <el-cascader
            :options="goodsListWithCate"
            :props="goodsCascader"
            v-model="addOrderForm.goods"
            clearable
            style="width:100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="重量(kg)" prop="weight">
          <el-input v-model.number="addOrderForm.weight" clearable></el-input>
        </el-form-item>
        <el-form-item label="下单时间" prop="createTime">
          <el-date-picker v-model="addOrderForm.createTime" type="datetime" placeholder="选择日期时间" style="width:100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="收货地址" prop="selectAddress">
          <el-cascader
            :options="option"
            v-model="addOrderForm.selectAddress"
            clearable
            :props="cascaderProps"
            style="width:100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="addOrderForm.detailAddress" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddOrderDialog">取 消</el-button>
        <el-button type="primary" @click="saveAddOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { regionData } from 'element-china-area-data';
export default {
  data () {
    return {
      orderList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      // 控制确认送达对话框显示隐藏
      checkArriveDialogVisible: false,
      arriveTime: null,
      // 确认日期和修改地址的单的id
      checkId: '',
      // 省市区数据
      selectAddress: [],
      // 详细地址
      detailAddress: '',
      // 级联选择器绑定的数据
      option: regionData,
      // 级联选择器配置
      cascaderProps: {
        children: 'children',
        expandTrigger: 'hover',
        value: 'label'
      },
      editAddressDialogVisible: false,
      // 查询的内容
      searchValue: '',
      // 添加订单的表单对象
      addOrderForm: {
        order_No: '',
        goods: '',
        sender: '',
        weight: null,
        createTime: null,
        selectAddress: [],
        detailAddress: ''
      },
      // 客户列表
      customerList: [],
      addOrderDialogVisible: false,
      // 与分类拼接好的物品数据
      goodsListWithCate: [],
      // 分类物品级联选择器的配置
      goodsCascader: {
        label: 'cat_Name',
        children: 'children',
        expandTrigger: 'hover',
        value: '_id',
        disabled: 'disabled'
      },
      // 添加订单的规则
      addOrderRules: {
        order_No: [
          { required: true, message: '请输入订单号', trigger: 'blur' }
        ],
        goods: [{ required: true, message: '请选择物品', trigger: 'blur' }],
        sender: [{ required: true, message: '请选择寄件人', trigger: 'blur' }],
        weight: [{ required: true, message: '请输入重量', trigger: 'blur' }],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'blur' }
        ],
        selectAddress: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        detailAddress: [
          { required: true, message: '请输入详细收货地址', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 获取订单列表
    async getOrders () {
      const { data: res } = await this.$axios.get('orders', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      this.orderList = res.data.docs;
      this.total = res.data.totalDocs;
    },

    // 处理时间的方法
    dateFormat (date) {
      var date1 = new Date(date);
      // 将标准日期处理成 yyyy-mm-dd 的格式
      // padStart()用于字符串头部补全,第一个参数指定字符串的长度,第二个参数指定用来补全的字符串
      // 获取的时间都是Number类型，故需要转为字符串的格式，然后使用padStart()方法
      var y = date1.getFullYear();
      var m = (date1.getMonth() + 1 + '').padStart(2, '0');
      var d = (date1.getDate() + '').padStart(2, '0');
      var hh = (date1.getHours() + '').padStart(2, '0');
      var mm = (date1.getMinutes() + '').padStart(2, '0');
      var ss = (date1.getSeconds() + '').padStart(2, '0');
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    },

    // 更改每页显示数据条数
    handleSizeChange (pagesize) {
      this.pagesize = pagesize;
      this.getOrders();
    },

    // 当前页发生变化,实现跳转页码
    handleCurrentChange (pagenum) {
      this.pagenum = pagenum;
      this.getOrders();
    },

    // 显示确认送达对话框
    showCheckArriveDialog (id) {
      this.checkArriveDialogVisible = true;
      this.checkId = id;
    },

    // 保存确认送达
    async saveCheckArrive () {
      const { data: res } = await this.$axios.put(`orders/${this.checkId}`, {
        arriveTime: this.arriveTime,
        isArrive: true
      });
      if (res.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '更新成功！',
          duration: 1000
        });
        this.getOrders();
      }
      this.checkArriveDialogVisible = false;
    },

    // 关闭确认送达对话框
    closeCheckArriveDialog () {
      this.checkArriveDialogVisible = false;
      this.arriveTime = null;
      this.checkId = '';
    },

    // 展示修改收获地址对话框
    async showEditAddressDialog (id) {
      // 根据id获取Order数据
      const { data: res } = await this.$axios.get('orders/' + id);
      const { arrive_Address: address } = this.$_.cloneDeep(res.data);
      const detailAddress = address.pop();
      this.selectAddress = address;
      this.detailAddress = detailAddress;
      this.checkId = id;
      this.editAddressDialogVisible = true;
    },

    // 确认修改收货地址
    async saveEditAddress () {
      const arriveAddress = this.selectAddress.concat(this.detailAddress);
      const { data: res } = await this.$axios.put(`orders/${this.checkId}`, {
        arrive_Address: arriveAddress
      });
      if (res.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '修改成功！',
          duration: 1000
        });
        this.getOrders();
      }
      this.editAddressDialogVisible = false;
    },

    // 关闭修改地址对话框
    closeEditAddressDialog () {
      this.editAddressDialogVisible = false;
    },

    // 删除订单
    async deleteOrder (id) {
      const confirm = await this.$confirm('是否删除该订单？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err);
      if (confirm === 'confirm') {
        const { data: res } = await this.$axios.delete('orders/' + id);
        if (res.meta.status === 200) {
          this.$message.success('删除成功');
          // 重新获取数据
          this.getOrders();
        }
      }
    },

    // 根据关键字(订单编号)查询订单
    async querySearch () {
      const { data: res } = await this.$axios.get('orders', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          order_No: this.searchValue
        }
      });
      this.orderList = res.data.docs;
      this.total = res.data.totalDocs;
    },

    // 获取客户列表
    async getCustomers () {
      const { data: res } = await this.$axios.get('customers');
      this.customerList = res.data.docs;
    },

    // 获取分类+物品列表
    async getGoodsWithCate () {
      const { data: res } = await this.$axios.get('goods/withCate');
      this.goodsListWithCate = res.data;
      console.log('aaaaaaaa', this.goodsListWithCate);
    },

    // 确认添加订单
    saveAddOrder () {
      this.$refs.addOrderRef.validate(async valid => {
        console.log(valid);
        if (valid) {
          // 验证成功
          const cloneForm = this.$_.cloneDeep(this.addOrderForm);
          const { selectAddress, detailAddress, goods } = cloneForm;
          selectAddress.push(detailAddress);
          const form = this.$_.omit(cloneForm, ['selectAddress', 'detailAddress', 'selectGoods']);
          form.arrive_Address = selectAddress;
          form.goods = goods.pop();
          // 发起请求
          const { data: res } = await this.$axios.post('orders', form);
          if (res.meta.status === 200) {
            this.$message.success('添加成功');
            this.addOrderDialogVisible = false;
            // 重置表单
            this.$refs.addOrderRef.resetFields();
            this.getOrders();
          }
        } else {
          // 验证失败
          this.$message({
            type: 'error',
            message: '请输入完整的数据'
          });
        }
      });
    },

    // 关闭添加订单对话框
    closeAddOrderDialog () {
      this.addOrderDialogVisible = false;
      this.$refs.addOrderRef.resetFields();
    }
  },

  created () {
    this.getOrders();
    this.getCustomers();
    this.getGoodsWithCate();
  }
};
</script>

<style lang="scss" >
.ordersTable {
  margin-top: 10px;
}
.table-expand label {
  width: 80px;
  color: #88c3ff;
  font-weight: 500;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
