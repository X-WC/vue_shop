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
          <el-button type="primary">添加分类</el-button>
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
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
    </el-card>
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
      }]
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
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('请求商品分类列表失败')
      this.cateList = res.data.result
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped>
.treetable{
  margin-top: 15px;
}
</style>
