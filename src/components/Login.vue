<template>
  <div class="login_container">
    <!-- 登录盒子 -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img class="avator_img" src="https://img2.baidu.com/it/u=4176124409,3953616922&fm=26&fmt=auto&gp=0.jpg" alt="头像">
      </div>
      <!-- 登录表单 -->
      <el-form ref="form" :model="loginForm" label-width="80px">
        <el-form-item prop="username">
          <el-input v-model="loginForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
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
      loginForm: {
        name: 'admin'
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
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
        top:-25%;
        left: 50%;
        transform: translateX(-50%);
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
</style>
