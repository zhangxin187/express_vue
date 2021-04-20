<template>
  <div class="goods">
    <!-- 操作区域 -->
    <div class="operateArea">
      <el-row :gutter="20">
        <el-col :span="9">
          <div class="search">
            <el-input
              placeholder="请输入查询内容"
              clearable
              v-model.trim="searchValue"
              @clear="getGoods"
              @keyup.enter.native="querySearch"
              @change="querySearch"
            >
              <el-button slot="append" icon="el-icon-search" @click="querySearch"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="addGoodsDialogVisible = true">添加物品</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 商品列表 -->
    <div class="goodsTable">
      <el-table :data="goodsList" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="物品名" prop="goods_Name">
          <template v-slot="scope">
            <span v-show="!GoodsNameInputVisible">
              {{
              scope.row.goods_Name
              }}
            </span>
            <el-input
              class="goodsInput"
              ref="editGoodsNameInput"
              v-show="GoodsNameInputVisible"
              v-model="scope.row.goods_Name"
              size="small"
              @keyup.enter.native="saveEditGoodsName(scope.row)"
              @blur="saveEditGoodsName(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="所属分类">
          <template v-slot="scope">
            <el-tag type="primary">{{ scope.row.category.cat_Name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                round
                @click="showEditInput(scope.row.goods_Name)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                round
                @click="deleteGoods(scope.row._id)"
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

    <!-- 添加物品的对话框 -->
    <el-dialog title="添加物品" :visible.sync="addGoodsDialogVisible" width="40%" >
      <!-- 表单 -->
      <el-form
        ref="addGoodsRef"
        :model="addGoodsForm"
        :rules="rules"
        label-width="80px"
        style="width:95%"
        status-icon
      >
        <el-form-item label="物品名" prop="goods_Name">
          <el-input v-model="addGoodsForm.goods_Name" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="category">
          <el-cascader
            :options="categoriesTree"
            :props="cascaderProps"
            v-model="selectValue"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddGoodsDialog">取 消</el-button>
        <el-button type="primary" @click="saveAddGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      // 编辑物品名的输入框显示隐藏状态
      GoodsNameInputVisible: false,
      // 原物品名,用来和更改后的name进行对比,查看是否有效更改
      initGoodsName: '',
      // 查询参数
      searchValue: '',
      // 控制添加物品对话框显示隐藏
      addGoodsDialogVisible: false,
      // 添加物品的表单
      addGoodsForm: {
        goods_Name: ''
      },
      // 树状分类数据
      categoriesTree: [],
      // 级联选择器配置
      cascaderProps: {
        label: 'cat_Name',
        children: 'children',
        expandTrigger: 'hover',
        // 父子节点互不相关联
        // checkStrictly: true,
        value: '_id',
        disabled: 'disabled'
      },
      // 级联选择器选择的值
      selectValue: [],
      rules: {
        goods_Name: [
          { required: true, message: '请输入商品名', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 获取商品列表
    async getGoods () {
      const { data: res } = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      this.goodsList = res.data.docs;
      this.total = res.data.totalDocs;
    },

    // 获取分类树状列表
    async getCategoriesTree () {
      const { data: res } = await this.$axios.get('categories/', {
        params: {
          type: 'tree'
        }
      });
      this.categoriesTree = res.data;
      console.log(res);
    },

    // 更改每页显示数据条数
    handleSizeChange (pagesize) {
      this.pagesize = pagesize;
      this.getGoods();
    },

    // 当前页发生变化,实现跳转页码
    handleCurrentChange (pagenum) {
      this.pagenum = pagenum;
      this.getGoods();
    },

    // 点击编辑,显示编辑物品名的input
    showEditInput (name) {
      // name是编辑前的物品名
      this.initGoodsName = name;
      this.GoodsNameInputVisible = true;
      // nextTick在下次更新渲染后,执行里面的函数
      // 此处当input出来后,在获取焦点，若不加nextTick,input获取焦点时,input还没显示出来,当显示出来时,焦点已经不存在了
      this.$nextTick(() => {
        this.$refs.editGoodsNameInput.focus();
      });
    },

    // 保存编辑的物品名
    async saveEditGoodsName (row) {
      // 如果未更改名字,则直接跳出函数
      if (this.initGoodsName === row.goods_Name.trim()) {
        this.GoodsNameInputVisible = false;
        return;
      }
      const { data: res } = await this.$axios.put(`goods/${row._id}`, {
        goods_Name: row.goods_Name
      });
      if (res.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '修改成功！',
          duration: 1000
        });
        this.getGoods();
      }
      this.GoodsNameInputVisible = false;
    },

    // 删除物品
    async deleteGoods (id) {
      const confirm = await this.$confirm('是否删除该物品？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err);
      if (confirm === 'confirm') {
        const { data: res } = await this.$axios.delete('goods/' + id);
        if (res.meta.status === 200) {
          this.$message.success('删除成功');
          // 重新获取数据
          this.getGoods();
        }
      }
    },

    // 添加商品
    async saveAddGoods () {
      const categoryId = this.selectValue[this.selectValue.length - 1];
      const { data: res } = await this.$axios.post('goods', {
        goods_Name: this.addGoodsForm.goods_Name,
        category: categoryId
      });
      if (res.meta.status === 200) {
        this.$message.success('添加成功!');
        // 清空数据
        this.addGoodsForm.goods_Name = '';
        this.selectValue = [];
        // 重新获取数据
        this.getGoods();
        this.addGoodsDialogVisible = false;
        this.$refs.addGoodsRef.resetFields();
        this.selectValue = [];
      }
    },

    // 查询商品数据
    async querySearch () {
      const { data: res } = await this.$axios.get('goods', {
        params: {
          goods_Name: this.searchValue,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      this.goodsList = res.data.docs;
      this.total = res.data.totalDocs;
    },

    // 关闭添加商品对话框
    closeAddGoodsDialog () {
      this.addGoodsDialogVisible = false;
      this.$refs.addGoodsRef.resetFields();
      this.selectValue = [];
    }
  },

  created () {
    this.getGoods();
    this.getCategoriesTree();
  }
};
</script>

<style lang="scss" scoped>
.goodsTable {
  margin-top: 10px;
}
.goodsInput {
  width: 150px;
}
</style
>>
