<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <template #append>
              <el-button icon="el-icon-search" @click="getUserList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" stripe border>
        <!-- 添加索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="180px">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyUser(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="assigningRoles(scope.row)"></el-button>
              </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 20, 30]"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户弹窗区域 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <!-- 表单区域 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addForm"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="addNewUser">确 定</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 修改用户信息弹窗区域 -->
      <!-- 修改用户弹窗区域 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="50%"
      >
        <!-- 表单区域 -->
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editForm"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="modifyUserInfo">确 定</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 分配角色弹框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="rolesDialogVisible"
        width="50%"
        @close="setRoleDialogClosed"
      >
        <div>
          <p>当前的用户：{{userInfo.username}}</p>
          <p>当前的角色：{{userInfo.role_name}}</p>
          <p>分配新角色：
            <el-select v-model="selectedRoleId" placeholder="请选择角色">
              <el-option v-for="item of roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
          </p>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="rolesDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="modifyTheRole(userInfo.id, selectedRoleId)">确 定</el-button>
          </span>
        </template>
      </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  data () {
    // 自定义校验规则
    var checkMobile = (rule, value, callback) => {
      if (value) {
        const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
        if (regMobile.test(value)) {
          return callback()
        }
        callback(new Error('请输入合法的手机号'))
      }
      return callback()
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0,
      // 将添加用户的弹出框设置为false
      dialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        email: [
          { message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', trigger: 'blur' }
        ],
        mobile: [
          { message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色弹框的显示与隐藏
      rolesDialogVisible: false,
      // 控制分配角色的用户信息
      userInfo: {},
      // 保存用户选中的角色id
      selectedRoleId: '',
      // 保存用户角色列表
      roleList: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('请求用户列表失败')
      }
      // console.log(res)
      this.total = res.data.total
      this.userList = res.data.users
    },
    // 监听pagesize事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变事件
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 修改用户状态
    async userStateChanged (userInfo) {
      // console.log(userInfo)
      // console.log(typeof userInfo.id)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$$message.error('修改用户状态失败')
      }
      this.$message.success('修改用户状态成功')
    },
    // 关闭弹窗后重置表单
    addDialogClosed () {
      // 重置表单
      this.$refs.addForm.resetFields()
    },
    // 添加新用户
    addNewUser () {
      // 表单预校验
      this.$refs.addForm.validate(async validator => {
        if (!validator) {
          return this.$message.error('请输入完整信息')
        }
        // 上传新用户信息
        const { data: res } = await this.$http.post('users', this.addForm)
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加新用户失败')
        this.$message.success('添加新用户成功')
        // 关闭弹窗
        this.dialogVisible = false
        // 重新渲染用户列表
        this.getUserList()
      })
    },
    // 修改用户信息
    async modifyUser (id) {
      const { data: res } = await this.$http.get('users/' + id)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 表单的预校验
    modifyUserInfo () {
      this.$refs.editForm.validate(async validator => {
        // console.log(validator)
        if (!validator) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户信息失败')
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改用户信息成功')
      })
    },
    // 删除用户
    async deleteUser (id) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(result)
      if (result === 'confirm') {
        const { data: res } = await this.$http.delete('users/' + id)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.getUserList()
        return this.$message.success('删除成功')
      }
      return this.$message.info('已取消删除')
    },
    // 分配角色
    async assigningRoles (userInfo) {
      this.userInfo = userInfo
      console.log(userInfo)
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return
      console.log(res)
      this.roleList = res.data
      this.rolesDialogVisible = true
    },
    // 修改角色
    async modifyTheRole () {
      // 判断 selectedRoleId 是否为空 如果为空则提示分配角色
      if (!this.selectedRoleId) return this.$message.error('请选择需要分配的角色')
      const { data: res } = await this.$http.put('users/' + this.userInfo.id + '/role', { rid: this.selectedRoleId })
      if (res.meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功')
      this.rolesDialogVisible = false
      this.getUserList()
    },
    // 关闭分配角色弹框时重置下拉框
    setRoleDialogClosed () {
      this.selectedRoleId = ''
      this.userInfo = []
    }
  }
}
</script>
