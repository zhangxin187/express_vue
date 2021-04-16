<template>
  <div class="category">
    <!-- 操作区域 -->
    <div class="operateArea">
      <el-row :gutter="15">
        <el-col :span="2">
          <el-button type="primary" @click="showAddCategoryDialog"
            >添加分类</el-button
          >
        </el-col>
        <el-col :span="3">
          <el-button type="success" @click="changeCateDataType">切换数据显示</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 分类列表 -->
    <div class="categoryTable">
      <!-- 普通列表 -->
      <el-table
        :data="categories"
        stripe
        border
        style="width: 100%"
        v-show="paginationVisible"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="cat_Name" label="名称"></el-table-column>
        <el-table-column prop="cat_Level" label="等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_Level === 0" type="success"
              >一级</el-tag
            >
            <el-tag v-if="scope.row.cat_Level === 1" type="primary"
              >二级</el-tag
            >
            <el-tag v-if="scope.row.cat_Level === 2" type="warning"
              >三级</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="disabled" label="是否有效">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.disabled"
              :active-value="false"
              :inactive-value="true"
              @change="changeStatus(scope.row)"
            ></el-switch>
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
                @click="showEditCategoryDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                round
                @click="deleteCategory(scope.row._id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 树形列表 -->
      <el-table
        v-show="!paginationVisible"
        :data="categoriesTree"
        row-key="_id"
        border
        :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="cat_Name" label="名称"></el-table-column>
        <el-table-column prop="cat_Level" label="等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_Level === 0" type="success"
              >一级</el-tag
            >
            <el-tag v-if="scope.row.cat_Level === 1" type="primary"
              >二级</el-tag
            >
            <el-tag v-if="scope.row.cat_Level === 2" type="warning"
              >三级</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="disabled" label="是否有效">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.disabled"
              :active-value="false"
              :inactive-value="true"
              @change="changeStatus(scope.row)"
            ></el-switch>
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
                @click="showEditCategoryDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                round
                @click="deleteCategory(scope.row._id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <el-pagination
      v-if="paginationVisible"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCategoryDialogVisible"
      width="40%"
      @close="closeEditCategoryDialog"
    >
      <!-- 表单 -->
      <el-form
        ref="editCategoryRef"
        :model="editCategoryForm"
        label-width="80px"
        style="width:95%"
        status-icon
      >
        <el-form-item label="分类名">
          <el-input v-model="editCategoryForm.cat_Name" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="editCategoryForm.disabled" :label="false"
            >启用</el-radio
          >
          <el-radio v-model="editCategoryForm.disabled" :label="true"
            >禁用</el-radio
          >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditCategoryDialog">取 消</el-button>
        <el-button type="primary" @click="saveEditCategory">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryDialogVisible"
      width="40%"
    >
      <!-- 表单 -->
      <el-form
        ref="addCategoryRef"
        :model="addCategoryForm"
        :rules="rules"
        label-width="80px"
        style="width:95%"
        status-icon
      >
        <el-form-item label="分类名" prop="cat_Name">
          <el-input v-model="addCategoryForm.cat_Name" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="addCategoryForm.disabled" :label="false"
            >启用</el-radio
          >
          <el-radio v-model="addCategoryForm.disabled" :label="true"
            >禁用</el-radio
          >
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :options="categoriesTree"
            :props="cascaderProps"
            v-model="selectValue"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddCategoryDialog">取 消</el-button>
        <el-button type="primary" @click="saveAddCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState, mapMutations } from 'vuex';
export default {
  data () {
    return {
      // 分类数据列表
      categories: [],
      // 分类树状列表
      categoriesTree: [],
      pagesize: 5,
      pagenum: 1,
      total: 0,
      viewType: 'list',
      // 控制编辑分类对话框显示隐藏
      editCategoryDialogVisible: false,
      editCategoryForm: {
        cat_Name: '',
        disabled: false
      },
      editId: '',
      // 控制添加分类对话框显示隐藏
      addCategoryDialogVisible: false,
      // 添加分类表单数据
      addCategoryForm: {
        cat_Name: '',
        disabled: false
      },
      // 级联选择器配置
      cascaderProps: {
        label: 'cat_Name',
        children: 'children',
        expandTrigger: 'hover',
        // 父子节点互不相关联
        checkStrictly: true,
        value: '_id',
        disabled: 'disabled'
      },
      // 级联选择器选择的值
      selectValue: [],
      // 添加分类表单验证
      rules: {
        cat_Name: [{ required: true, message: '请输入分类名', trigger: 'blur' }]
      }
    };
  },
  methods: {
    // 获取分类列表
    async getCategories () {
      const { data: res } = await this.$axios.get('categories/', {
        params: {
          type: 'list',
          pagesize: this.pagesize,
          pagenum: this.pagenum
        }
      });
      this.categories = res.data.docs;
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
    },

    // 更改每页显示数据条数
    handleSizeChange (pagesize) {
      this.pagesize = pagesize;
      this.getCategories();
    },

    // 当前页发生变化,实现跳转页码
    handleCurrentChange (pagenum) {
      this.pagenum = pagenum;
      this.getCategories();
    },

    // 修改分类状态,防抖
    changeStatus: _.debounce(
      async function (row) {
        const { data: res } = await this.$axios.put(`categories/${row._id}`, {
          disabled: row.disabled
        });
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '修改成功！',
            duration: 1000
          });
        }
      },
      1000,
      { leading: true }
    ),

    // 删除分类
    async deleteCategory (id) {
      const confirm = await this.$confirm('是否删除该分类？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (confirm === 'confirm') {
        console.log(id);
        const { data: res } = await this.$axios.delete('categories/' + id);
        if (res.meta.status === 200) {
          this.$message.success('删除成功');
          // 重新获取数据
          this.getCategories();
          this.getCategoriesTree();
        }
      }
    },

    // 显示编辑分类的对话框
    showEditCategoryDialog (row) {
      this.editCategoryDialogVisible = true;
      this.editCategoryForm.disabled = row.disabled;
      this.editCategoryForm.cat_Name = row.cat_Name;
      this.editId = row._id;
    },

    // 保存编辑的分类
    async saveEditCategory () {
      const { data: res } = await this.$axios.put(
        `categories/${this.editId}`,
        this.editCategoryForm
      );
      if (res.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '更新分类成功',
          duration: 1000
        });
        this.editCategoryDialogVisible = false;
        this.getCategories();
      }
    },

    // 关闭编辑对话框
    closeEditCategoryDialog () {
      this.$refs.editCategoryRef.resetFields();
      this.editId = '';
      this.editCategoryDialogVisible = false;
    },

    // 显示添加分类对话框
    showAddCategoryDialog () {
      // 重新获取树状分类列表
      this.getCategoriesTree();
      this.addCategoryDialogVisible = true;
    },

    // 保存添加分类
    async saveAddCategory () {
      const { data: res } = await this.$axios.post('categories', {
        cat_Name: this.addCategoryForm.cat_Name,
        disabled: this.addCategoryForm.disabled,
        cat_Pid: this.parentId,
        cat_Level: this.selectValue.length
      });
      if (res.meta.status === 200) {
        this.$message.success('添加成功!');
        // 清空数据
        this.addCategoryForm.cat_Name = '';
        this.selectValue = [];
        // 重新获取数据
        this.getCategoriesTree();
        this.getCategories();
        this.addCategoryDialogVisible = false;
      }
    },

    // 关闭添加分类对话框
    closeAddCategoryDialog () {
      this.addCategoryDialogVisible = false;
      // 清空数据
      this.addCategoryForm.cat_Name = '';
      this.selectValue = [];
      this.$refs.addCategoryRef.resetFields();
    },
    // 切换分类数据显示类型
    ...mapMutations(['changeCateDataType'])

  },

  computed: {
    ...mapState(['categoryDataType']),
    paginationVisible () {
      // 显示列表数据时,展示分页
      return this.categoryDataType === 'list';
    },
    // 返回添加分类的分级id
    parentId () {
      if (this.selectValue.length === 0) {
        return null;
      } else {
        // 上一级父类id
        return this.selectValue[this.selectValue.length - 1];
      }
    }
  },

  created () {
    this.getCategories();
    this.getCategoriesTree();
  }
};
</script>

<style lang="scss" scoped>
.categoryTable {
  margin-top: 10px;
}
</style>
