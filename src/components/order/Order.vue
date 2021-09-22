<template>
  <div>
    <!-- 面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="searchInput" class="input-with-select" closed>
            <template #append>
              <el-button icon="el-icon-search" @click="searchContent"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否支付">
          <template slot-scope="scope">
             <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
             <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="125px">
          <template slot-scope="">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditAddress"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgress"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 弹出编辑对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="addressDialogClosed"
      >
        <el-form :model="addressForm" ref="addressFormRef" :rules="addFormRules" label-width="100px">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              style="width:100%"
              :options="cityData"
              v-model="addressForm.address1"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 弹出物流跟踪弹框 -->
      <el-dialog
        title="物流进度"
        :visible.sync="progressDialogVisible"
        width="50%"
      >
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time"
          >
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="progressDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="progressDialogVisible = false">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 导入城市数据
import cityData from './citydata'
export default {
  name: 'Order',
  data () {
    return {
      // 用户信息
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      // 数据的总数量
      total: 0,
      // 数据列表
      orderList: [],
      // 控制编辑对话框是否显示
      editDialogVisible: false,
      // 编辑收货地址的表单
      addressForm: {
        address1: [],
        address2: ''
      },
      // 城市数据
      cityData: cityData,
      // 编辑表单校验规则
      addFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 控制物流进度弹框是否显示
      progressDialogVisible: false,
      // 保存物流信息
      progressInfo: [],
      // 搜索框内容
      searchInput: ''
    }
  },
  created () {
    // 当页面加载时 调用获取订单数据函数
    this.getOrderList()
  },
  methods: {
    // 获取订单数据函数
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('请求数据列表失败')
      console.log(res.data)
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    handleSizeChange (newSize) {
      // 监听每页显示条数
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      // 监听页码值
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 监听点击编辑按钮事件
    showEditAddress () {
      this.editDialogVisible = true
    },
    // 弹出编辑框关闭时重置表单
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 监听点击物流进度按钮事件
    async showProgress () {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('物流进度获取失败')
      this.progressInfo = res.data
      this.progressDialogVisible = true
    },
    // 监听搜索框是否被点击
    searchContent () {
      console.log(123)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
