// 路由文件
import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login')
// import Home from '../components/Home'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home')
// import Welcome from '../components/Welcome'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome')

// import User from '../components/user/User'
const User = () => import(/* webpackChunkName: "User_Rights_Roles" */ '../components/user/User')
// import Rights from '../components/power/Rights'
const Rights = () => import(/* webpackChunkName: "User_Rights_Roles" */ '../components/power/Rights')
// import Roles from '../components/power/Roles'
const Roles = () => import(/* webpackChunkName: "User_Rights_Roles" */ '../components/power/Roles')

// import Cate from '../components/goods/Cate'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate')
// import Params from '../components/goods/Params'
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params')

// import Goods from '../components/goods/Goods'
const Goods = () => import(/* webpackChunkName: "Goods_Add" */ '../components/goods/Goods')
// import Add from '../components/goods/Add'
const Add = () => import(/* webpackChunkName: "Goods_Add" */ '../components/goods/Add')

// import Order from '../components/order/Order'
const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order')
// import Report from '../components/report/Report'
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report')

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
      }, {
        path: '/categories',
        component: Cate
      }, {
        path: '/params',
        component: Params
      }, {
        path: '/goods',
        component: Goods
      }, {
        path: '/goods/add',
        component: Add
      }, {
        path: '/orders',
        component: Order
      }, {
        path: '/reports',
        component: Report
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
