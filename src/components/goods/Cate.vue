<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片模块 -->
    <el-card>
      <!-- 添加分类模块 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类表格模块 -->
      <tree-table
      :data="cateList"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      index-text="#"
      show-index
      border
      :show-row-hover="false"
      class="treetable"
      >
        <!-- 是否有效板块 -->
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted == true"  class="el-icon-success" style="color:lightgreen;"></i>
          <i v-else class="el-icon-error" style="color:red;"></i>
        </template>
        <!-- 排序板块 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level =='0'" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level =='1'" size="mini" type="success">二级</el-tag>
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>
        <!-- 操作板块 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editClassification">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页模块 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    </el-card>
    <!-- 添加分类弹出框 -->
     <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <el-form
      ref="addCateForm"
      :model="addCateForm"
      :rules="addCateRules"
      label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
           <el-cascader
            v-model="selectedKeys"
            :options="parentList"
            :props="props"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="50%"
    >
    <!-- @close="editDialogClosed" -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data () {
    return {
      // 商品分类的数据
      cateList: [],
      // 查询条件
      queryInfo: {
        type: '',
        pagenum: 1,
        pagesize: 10
      },
      // 数据的总数
      total: 0,
      cateTreeProps: {
        children: 'children',
        label: 'cat_name'
      },
      // 为table指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        prop: '',
        type: 'template', // 将该列设置为模板列
        template: 'isok' // 设置该列模板的名称
      }, {
        label: '排序',
        prop: '',
        type: 'template',
        template: 'order'
      }, {
        label: '操作',
        prop: '',
        type: 'template',
        template: 'opt'
      }],
      // 控制添加分类的弹出框显示与隐藏
      addDialogVisible: false,
      // 添加分类表单数据
      addCateForm: {
        // 分类名称
        cat_name: '',
        // 父级分类id
        cat_id: 0,
        // 添加分类的等级
        cat_level: 0
      },
      // 添加分类表单的校验规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级数据列表
      parentList: [],
      // 配置级联菜单中数据如何展示
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 父级id值的数据
      selectedKeys: [],
      // 控制编辑弹出框显示与隐藏
      editDialogVisible: false
    }
  },
  // 当页面渲染时获取分类的数据
  created () {
    this.getCateList()
  },
  methods: {
    // 获取分类的数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('请求商品分类列表失败')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 获取父级分类的数据列表
    async parentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类数据失败')
      // console.log(res)
      this.parentList = res.data
    },
    // 当修改父级分类的时候
    parentCateChange () {
      // 当级联菜单发生改变的时候
      // console.log(this.selectedKeys)
      // 判断是否选择修改父级分类
      if (this.selectedKeys.length > 0) {
        // 将数组的最后一项改为父级分类
        this.addCateForm.cat_id = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys[this.selectedKeys.length]
      } else {
        this.addCateForm.cat_id = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 监听添加分类按钮的点击事件
    addCate () {
      // console.log(this.addCateForm)
      // 点击确定，完成添加分类
      console.log(this.addCateForm)
      this.$refs.addCateForm.validate(async valid => {
        if (!valid) return
        // 发送请求完成添加分类
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }

        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听页码值改变事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听每页数据量的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 监听编辑按钮的点击事件
    editClassification () {
      this.editDialogVisible = true
    }
    // 重置编辑框表单
    // editDialogClosed () {
    //   this.$refs.editForm.resetField()
    // }
  }
}
</script>

<style lang="less" scoped>
.treetable{
  margin-top: 15px;
}
.el-cascader {
  width: 100%
}
</style>
