import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  //不是红旗手 只能看商户列表
  routes: [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path: '/nav',
      name: 'nav',
      meta:{
        title:'航巡',
        isRed:false
      },
      component: () => import('@/components/common/Nav')
    },
    {
      path: '/login',
      name: 'login',
      meta:{
        title:'登录',
        isRed:false
      },
      component: () => import('@/components/common/Login')
    },
    //商户入驻
    {
      path: '/merchant',
      name: 'merchant',
      meta:{
        title:'商户入驻',
        isRed:true
      },
      component: () => import('@/components/Merchant')
    },
    //商户列表
    {
      path: '/merchantList',
      name: 'merchantList',
      meta:{
        title:'商户列表',
        isRed:false
      },
      component: () => import('@/components/MerchantList')
    },
    //待接单列表
    {
      path: '/orderList',
      name: 'orderList',
      meta:{
        title:'订单列表',
        isRed:true
      },
      component: () => import('@/components/OrderList')
    },
    //待接单列表详情
    {
      path: '/orderDetail',
      name: 'orderDetail',
      meta:{
        title:'订单详情',
        isRed:true
      },
      component: () => import('@/components/OrderDetail')
    },
    
    {
      path: '/redflag',
      name: 'redflag',
      meta:{
        title:'红旗手'
      },
      component: () => import('@/components/Redflag')
    },
    {
      path: '/toRed',
      name: 'toRed',
      meta: {
        title: '生成邀请码' //生成成为红旗手邀请码
      },
      component: () => import('@/components/ToRed')
    },
  ]
})
// router.beforeEach(function(to, from, next){
//   //从元数据中 是否需要红旗手
//   if(!to.meta.isRed){
//       next()
//   }else {
//       let isRed = localStorage.getItem("isRed"); //是否是红旗手
//       //去我订单页面 需要先登录
//       if(isRed){
//           next()
//       }else{
//           next({name:'login'}) //没有登录 重定向到登录页面
//       }
//   }
  
// })
export default  router