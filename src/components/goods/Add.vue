<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <!-- 弹出信息模块 -->
          <el-alert
            center
            show-icon
            :closable="false"
            title="添加商品信息"
            type="info">
          </el-alert>
        </el-col>
      </el-row>
      <!-- 步骤条模块 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单模块 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- 切换标签页模块 -->
        <el-tabs v-model="activeIndex" @tab-click="handleClick" :tab-position="'left'" :before-leave="beforeLeave">
          <!-- 基本信息模块 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :props="cateProps"
                :options="cateList"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数模块 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox border :label="val" v-for="(val, i) in item.attr_vals" :key="i"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性模块 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片模块 -->
          <el-tab-pane label="商品图片" name="3">
             <el-upload
              class="upload-demo"
              action="https://lianghj.top:8888/api/private/v1/upload"
              :headers="uploadHeaders"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              >
              <el-button size="small" type="primary">点击上传</el-button>
             </el-upload>
          </el-tab-pane>
          <!-- 商品内容模块 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <el-button type="primary" class="add_btn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片的弹窗 -->
    <el-dialog
      title="图片预览"
      :visible.sync="picDialogVisible"
      width="50%"
    >
      <img :src="previewPath" alt="">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'goodAdd',
  data () {
    return {
      activeIndex: '0',
      // 表单绑定的值
      addForm: {
        goods_name: '',
        goods_price: '0',
        goods_weight: '0',
        goods_number: '0',
        goods_cat: [],
        // 图片的数组
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 表达的校验规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      // 配置级联菜单中数据如何展示
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 用户分类列表
      cateList: [],
      // 动态参数的数据列表
      manyTableData: [],
      // 静态属性的数据列表
      onlyTableData: [],
      // 设置上传图片的请求头部信息
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 定义预览图片的url地址
      previewPath: '',
      // 控制图片预览窗口是否显示
      picDialogVisible: false,
      content: '<h2>I am Example</h2>',
      editorOption: {
        // Some Quill options...
      }
    }
  },
  // 当页面重新加载时
  created () {
    this.getCateList()
  },
  methods: {
    // 点击切换tab拦
    async handleClick (tab, event) {
      // console.log(tab.index)
      // 将点击的index值传给activeIndex
      // this.activeIndex = tab.index
      // 当用户点击切换tab栏时触发
      if (this.activeIndex === '1') {
        // 发送请求获取动态参数列表
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
        // 将动态参数每一项数据中的attr_vals的字符串变化为数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
        // console.log(this.manyTableData)
      } else if (this.activeIndex === '2') {
        // 发送请求获取静态属性
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error('获取属性列表失败')
        // res.data.forEach(item => {
        //   item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        // })
        this.onlyTableData = res.data
      }
    },
    // 获取所有商品的分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.cateList = res.data
    },
    // 监听级联列表是否发生改变
    handleChange () {
      // 如果用户选择的不是三级分类 则该选择无效 因为必须选择三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // tab栏切换之前验证信息
    beforeLeave (activeName, oldActiveName) {
      if (oldActiveName === '0') {
        // 在第一个tab栏的时候
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.error('请选择商品的分类')
          return false
        } else if (this.addForm.goods_name.trim() === '') {
          this.$message.error('请选择商品名称')
          return false
        }
        // else if (this.addForm.goods_price.trim() === '0') {
        //   this.$message.error('请选择商品价格')
        //   return false
        // } else if (this.addForm.goods_weight.trim() === '0') {
        //   this.$message.error('请选择商品重量')
        //   return false
        // } else if (this.addForm.goods_number.trim() === '0') {
        //   this.$message.error('请选择商品数量')
        //   return false
        // }
      }
    },
    // 预览图片的时候 触发的方法
    handlePreview (result) {
      console.log(result)
      this.previewPath = result.response.data.url
      this.picDialogVisible = true
    },
    // 监听图片被移除的事件
    handleRemove (file) {
      // 获取删除图片的临时路径
      console.log(file)
      const filePath = file.response.data.tmp_path
      // 从pic数组中 找到这个图片所对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 移除对应索引项的数组
      this.addForm.pics.splice(i, 1)
      // console.log(this.addForm.pics)
    },
    // 监听图片上传成功的事件
    handleSuccess (response) {
      console.log(response)
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 添加商品
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 执行添加商品的业务逻辑
        // 对addForm表单进行深拷贝
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join('')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // console.log(form)
        // 发起请求 添加商品
        const { data: res } = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        // 编程式导航跳转到商品列表
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 获取选中的三级id值
    cateId () {
      // console.log(this.addForm.goods_cat.length)
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps{
  margin: 15px 0;
}
.el-checkbox{
  margin-right: 10px;
}
.add_btn{
  margin-top: 15px;
}
</style>
