// 路由文件
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/user/User'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      component: Login
    }, {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{
        path: '/welcome',
        component: Welcome
      }, {
        path: '/users',
        component: User
      }, {
        path: '/rights',
        component: Rights
      }, {
        path: '/roles',
        component: Roles
      }]
    }
  ]
})

// 添加路由导航守卫
router.beforeEach((to, from, next) => {
  // to 代表的是去哪一个页面
  if (to.path === '/login') return next()
  // from代表的是从哪一个页面而来
  const tokenStr = window.sessionStorage.getItem('token')
  // next是一个函数 表示放行/强制性跳转
  if (!tokenStr) return next('/login')
  next()
})

export default router
