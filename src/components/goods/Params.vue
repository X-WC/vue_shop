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
        <!-- 添加参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isButtonDisabled" @click="paramsDialogVisible = true">添加参数</el-button>
          <!-- 添加参数表格 -->
          <el-table :data="manyTableData" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  :disable-transitions="true"
                  @close="handleClose(i, scope.row)"
                  >
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else size="small" class="button-new-tag" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialogVisible=true">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isButtonDisabled" @click="paramsDialogVisible=true">添加属性</el-button>
          <!-- 添加属性表格 -->
          <el-table :data="onlyTableData" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  :disable-transitions="true"
                  @close="handleClose(i, scope.row)"
                  >
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else size="small" class="button-new-tag" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialogVisible=true">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数/属性弹出框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="paramsDialogVisible"
      width="50%"
      @close="paramsClosed"
    >
      <el-form ref="addParamsRef"
        :model="addForm"
        :rules="addParamsRules"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="paramsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改参数/属性弹出框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
      >
      <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="editFormRules"
      label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
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
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 控制添加参数弹出框的显示与隐藏
      paramsDialogVisible: false,
      // 添加参数的数据
      addForm: {
        attr_name: ''
      },
      // 添加参数表单的校验规则
      addParamsRules: {
        attr_name: [
          { required: true, message: '请输入添加的分类', trigger: 'blur' }
        ]
      },
      // 编辑弹框的显示与隐藏
      editDialogVisible: false,
      // 编辑弹框的数据
      editForm: {
        attr_name: ''
      },
      // 编辑弹框的校验规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入添加的分类', trigger: 'blur' }
        ]
      }
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
      // console.log(this.selectCateKeys)
      // 获取参数列表
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      // console.log(res)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else if (this.activeName === 'only') {
        this.onlyTableData = res.data
      }
    },
    // 监听tab栏切换
    handleClick () {
      // console.log(this.activeName)
      this.handleChange()
    },
    // 添加分类/属性
    addParams () {
      // 发起预校验
      this.$refs.addParamsRef.validate(async valid => {
        if (!valid) return
        // console.log(this.activeName)
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName, attr_vals: 'a,b,c' })
        if (res.meta.status !== 201) return this.$message.error('添加参数失败')
        this.$message.success('添加参数成功')
        // console.log(res)
        this.paramsDialogVisible = false
        this.getCateList()
        this.handleChange()
      })
    },
    // 添加分类/属性弹框关闭时重置表单
    paramsClosed () {
      this.$refs.addParamsRef.resetFields()
    },
    // 删除弹框
    async deleteParams (attrid) {
      // console.log(attrid)
      const result = await this.$confirm('此操作将永久删除该' + this.titleText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(result)
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrid}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除' + this.titleText + '成功!')
      this.getCateList()
      this.handleChange()
    },
    // 编辑参数/属性
    editParams () {
      // 发起预校验
      this.$refs.editFormRef.validate(async valid => {
        // if (!valid) return
      })
      this.editDialogVisible = false
    },
    // 编辑弹框关闭时重置表单
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 文本框处理函数
    handleInputConfirm (row) {
      // 文本框按下enter键/失去焦点都会触发执行
      // 判断用户在文本框中输入的内容是否合法
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      } else {
        // 如果数据合法 需要保存数据
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        // 调用保存数据的函数
        this.saveAttrVals(row)
      }
    },
    // 按钮的点击事件
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        // 让文本框获得焦点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 保存数据
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
      if (res.meta.status !== 200) return this.$message.error('修改参数项失败')
      this.$message.success('修改参数项成功')
    },
    // 关闭tag标签
    handleClose (index, row) {
      // 删除对应索引的参数可选项
      row.attr_vals.splice(index, 1)
      // 调用函数 完成保存可选项的操作
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 获取按钮是否被禁用
    isButtonDisabled () {
      return this.selectCateKeys.length !== 3
    },
    // 获取选中的三级id值
    cateId () {
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[this.selectCateKeys.length - 1]
      }
      return null
    },
    // 判断弹出框中的标题内容
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
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
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
