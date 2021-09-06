<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 折叠隐藏区域 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu
           v-for="item of menuList"
          :key="item.id"
          :index="item.id+''">
            <!-- 一级菜单模版区域 -->
            <template #title>
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
              <!-- 二级菜单 -->
              <el-menu-item
              :index="'/'+ subItem.path"
              v-for="subItem of item.children"
              :key="subItem.id"
              @click="savePath('/'+ subItem.path)"
              >
                <!-- 二级菜单模版区域 -->
                <template #title>
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menuList: [],
      iconObj: {
        125: 'iconfont icon-yonghu',
        103: 'iconfont icon-component-full',
        101: 'iconfont icon-gouwudai',
        102: 'iconfont icon-dingdan',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  // 当页面重新加载时用的生命周期函数
  created () {
    this.getMenuList()
    // 将本地存储的值给activePath
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
    },
    async getMenuList () {
      // 得到menus里的信息
      const { data: res } = await this.$http.get('menus', this.menuList)
      if (res.meta.status !== 200) return this.$message.error('请求失败')
      // console.log(res)
      // 将menus里的信息赋值给menuList
      this.menuList = res.data
    },
    // 是否折叠侧边栏 默认为false 取反为true
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    savePath (activePath) {
      // 将取到activePath值存到本地
      this.activePath = window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373d3f;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 32px;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
    height: 60px;
    img{
      height: 100%;
    }
    span{
      margin-left: 5px;
    }
  }
}
.el-aside{
  background-color: #333744;
  .toggle-button{
    font-size: 10px;
    color:#fff;
    text-align: center;
    line-height:24px;
    cursor: pointer;
    letter-spacing: 4px;
  }
  .el-menu {
    border-right: 0;
    .el-submenu {
      span{
      margin-left: 10px;
      }
    }
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>
