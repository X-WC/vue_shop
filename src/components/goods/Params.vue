<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" show-icon> </el-alert>
      <el-row>
        <!-- 商品分类选择模块 -->
        <el-col class="cat_opt">
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectCateKeys"
            :props="cateProps"
            :options="cateList"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 切换参数选项卡模块  -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isButtonDisabled">添加参数</el-button>
          <el-table :data="manyTableData" stripe border>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button type="primary" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isButtonDisabled">添加属性</el-button>
          <el-table :data="onlyTableData" stripe border>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button type="primary" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      // 用户分类列表
      cateList: [],
      // 用户在级联下拉菜单中选中的分类id
      selectCateKeys: [],
      // 配置级联菜单中数据如何展示
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 默认选择标签页
      activeName: 'many',
      // 控制按钮的是否被禁用
      isButtonDisabled: true,
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: []
    }
  },
  // 当页面重新加载时
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有商品的分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.$message.success('获取商品分类列表成功')
      this.cateList = res.data
    },
    // 监听级联列表是否发生改变
    async handleChange () {
      console.log(this.selectCateKeys)
      // 获取参数列表
      const { data: res } = await this.$http.get(`categories/${this.cateList.cat_id}/attributes`)
      console.log(res)
    },
    // 监听tab栏切换
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt{
  margin-top: 15px;
}
.el-tabs{
  margin-top: 15px;
}
</style>
