<template>
  <div class="login_container">
    <!-- 登录盒子 -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img class="avator_img" src="https://img2.baidu.com/it/u=4176124409,3953616922&fm=26&fmt=auto&gp=0.jpg" alt="头像">
      </div>
      <!-- 登录表单 -->
      <el-form class="login_form" :rules="rules" ref="loginForm" :model="loginForm">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-ren"></el-input>
        </el-form-item>
        <!-- 密码 -->
         <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-suo"></el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item class="btns">
           <el-button type="primary" @click="login">登录</el-button>
           <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 用户名及密码验证
      rules: {
        // 用户名验证规则
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 密码验证规则
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮 重置表单里的内容
    resetLoginForm () {
      // console.log(this)
      this.$refs.loginForm.resetFields()
    },
    // 登录之前表单预验证
    login () {
      this.$refs.loginForm.validate(async valid => {
        if (!valid) return
        // 使用awiat是因为返回值是一个promise函数 所以要await
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res.meta.status)
        // 判断状态码是不是200 如果不是 就失败 如果是 就成功
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功！')
        // 登录成功后把token值存在sessionStorage里面
        window.sessionStorage.setItem('token', res.data.token)
        // 使用编程式导航跳转页面
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container{
    display: flex;
    background-color: #2b5b6b;
    height: 100%;
    .login_box{
      position: relative;
      margin: auto;
      width: 450px;
      height: 300px;
      background-color: white;
      .avatar_box{
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #eee;
        width: 130px;
        height: 130px;
        padding: 10px;
        border:1px solid #eee;
        box-shadow:0 0 10px #ddd;
        border-radius: 50%;
        .avator_img{
          height: 100%;
          width: 100%;
          border-radius: 50%;
        }
      }
    }
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
</style>
