<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="roleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 渲染折叠页面中的内容 -->
            <el-row v-for="(item1,i1) of scope.row.children" :key="item1.id" :class="['bdbottom',i1 === 0?'bdtop':'','vcenter']">
              <!-- 渲染一级标签 -->
              <el-col :span="5">
                <el-tag
                closable
                @close="removeRightById(scope.row,item1.id)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级、三级标签 -->
              <el-col :span="19">
                <!-- 嵌套循环 -->
                <el-row v-for="(item2,i2) of item1.children" :key="item2.id" :class="[i2 === 0?'':'bdtop','vcenter']">
                  <!-- 二级标签 -->
                  <el-col :span="6">
                    <el-tag type="success"
                    closable
                    @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级标签 -->
                  <el-col :span="18">
                    <el-tag
                    type="warning"
                    v-for="(item3) of item2.children"
                    :key="item3.id"
                    closable
                    @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
              <!-- <pre>
                {{scope.row}}
              </pre> -->
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoles(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoles(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色弹出框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="roleDialogVisible"
        width="50%"
      >
        <el-form ref="addRolesForm"
        :model="addRolesForm"
        :rules="RolesRules"
        label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
           <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="roleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoles">确 定</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 编辑角色弹框 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form ref="editRolesForm"
        :model="editRolesForm"
        :rules="RolesRules"
        label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRolesForm.roleName"></el-input>
          </el-form-item>
           <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRolesInfo">确 定</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 分配权限弹框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setDialogVisible"
        width="50%"
        @close="setRightDialogClosed"
      >
      <!-- 树形控件 -->
        <el-tree
          ref="treeRef"
          :data="rightsList"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defkeys"
          :props="treeProps"
        >
        </el-tree>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="setDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="roleAuthorization()">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      // 角色列表
      roleList: [],
      // 添加角色弹框是否开启
      roleDialogVisible: false,
      // 添加角色表单
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 角色校验规则
      RolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 编辑角色弹框是否开启
      editDialogVisible: false,
      // 编辑角色表单
      editRolesForm: {},
      // 分配角色弹框是否开启
      setDialogVisible: false,
      rightsList: [],
      treeProps: {
        // 子节点的名称
        children: 'children',
        // 显示的信息
        label: 'authName'
      },
      // 默认选中的树形id值
      defkeys: [],
      // 获取即将分配角色的id值
      roleId: null
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      // console.log(res)
      this.roleList = res.data
    },
    // 添加新角色
    addRoles () {
      // 表单预校验
      this.$refs.addRolesForm.validate(async validator => {
        if (!validator) return
        // 上传角色信息
        const { data: res } = await this.$http.post('roles', { roleName: this.addRolesForm.roleName, roleDesc: this.addRolesForm.roleDesc })
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功')
        this.roleDialogVisible = false
        // 重新渲染列表
        this.getRoleList()
      })
    },
    // 重置添加角色表单
    addDialogClosed () {
      this.$refs.addRolesForm.resetFields()
    },
    // 编辑角色
    async editRoles (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      this.editRolesForm = res.data
      this.editDialogVisible = true
    },
    // 校验编辑角色
    editRolesInfo () {
      this.$refs.editRolesForm.validate(async validator => {
        if (!validator) return
        // 上传编辑后的角色信息
        const { data: res } = await this.$http.put('roles/' + this.editRolesForm.roleId, { roleName: this.editRolesForm.roleName, roleDesc: this.editRolesForm.roleDesc })
        if (res.meta.status !== 200) return this.$message.error('修改角色失败')
        this.$message.success('修改角色成功')
        this.editDialogVisible = false
        this.getRoleList()
      })
    },
    // 重置编辑角色表单
    editDialogClosed () {
      this.$refs.editRolesForm.resetFields()
    },
    // 删除角色
    async deleteRoles (id) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(result)
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return
      this.$message.success('删除成功!')
      // 更新渲染角色列表
      this.getRoleList()
    },
    // 删除角色权限
    async removeRightById (role, rightId) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(result)
      if (result !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除角色权限失败')
      this.$message.success('删除角色权限成功')
      // 重新赋值权限
      role.children = res.data
    },
    // 获取权限树
    async showSetRightDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取权限树失败')
      this.rightsList = res.data
      // 调用递归函数选中复选框
      this.getLeafKeys(role, this.defkeys)
      this.setDialogVisible = true
    },
    // 递归获取三级节点
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, this.defkeys)
      })
    },
    // 监听分配权限弹窗关闭事件
    setRightDialogClosed () {
      this.defkeys = []
    },
    // 角色授权
    async roleAuthorization () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 将数组转换为,分割的字符串
      const idStr = keys.join(',')
      // console.log(keys)
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.setDialogVisible = false
      this.getRoleList()
      this.$message.success('分配权限成功')
      // console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}

.bdtop{
  border-top: 1px solid #eee;
}

.vcenter{
  display: flex;
  align-items: center;
}
</style>
