import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Todos from '../views/Todos.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Users from '../views/Users.vue';
import Profile from '../views/Profile.vue';
import PageNotFound from '../views/PageNotFound.vue';
import AccountVerification from '../views/AccountVerification.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import Logout from '../views/Logout.vue';
// import myVue from '@/main'
import {vxm } from '@/store'
import config from '@/config'
import axios from 'axios'
import { getNamespacedPath } from 'vuex-class-component/dist/module';
Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: {name: 'Login'}
  },
  {
    path: '/login',
    name: 'Login',
    component: Login, // () => import('../views/Login.vue'),
    meta:{
      onlyGuests: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component:Register, // () => import('../views/Register.vue'),
    meta:{
      onlyGuests: true
    }
  },
  {
    path: '/management/users',
    name: 'Users',
    component:Users, // () => import('../views/Users.vue'),
    meta:{
      requiresAuth: true,
      requiresActiveAccount: true,
      is_admin: true,
      pageTitle: 'User Management'
    }
  },
  {
    path: '/users/:username/todos',
    name: 'Todos',
    component: Todos,// () => import('../views/Todos.vue'),
    meta:{
      requiresAuth: true,
      requiresActiveAccount: true,
      pageTitle: 'User to-do lists'
    }
  },
  {
    path: '/users/:username',
    name: 'Profile',
    component: Profile, // () => import('../views/Profile.vue'),
    meta:{
      requiresAuth: true,
      requiresActiveAccount: true,
      pageTitle: 'User Settings',
      firstTime: false
    },
    // check afterEach router configuration below 
    beforeEnter: (to, from, next)=>{
      let username = from.params.username || localStorage.getItem('username')
      if(!username)
        next({name:'Login'})
      else if(username && from.name=='AccountVerification'){
        to.meta.firstTime = true
        next()
      }else 
        next()
    }
  },
  {
    path: '/forgot_password',
    name: 'ForgotPassword',
    component: ForgotPassword,// () => import('../views/Todos.vue'),
    meta:{
      onlyGuests: true
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next)=>{
      localStorage.clear()
      vxm.user.logout()
      next({name:'Login'})
      // myVue.$Message.success('logout successful')
    }
  },
  {
    path: '/account_verification',
    name: 'AccountVerification',
    component: AccountVerification,
    meta:{
      requiresAuth: true,
    },
    // beforeEnter(to, from, next){
    //   console.log(to.fullPath)
    //   console.log(from.fullPath)
    //   console.log('about to enter broki')
    // }
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound, // () => import('../views/PageNotFound.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.afterEach((to, from)=>{
  if(from.name == 'Profile')
    from.meta.firstTime = false
})

function checkRedirect(to : any, from: any, user: any){
  // let redirect = null
  // let username = localStorage.getItem('username') || ((vxm.user.activeUser) ? vxm.user.activeUser.username : '')
  // let userIsAdmin = ((vxm.user.activeUser) ? vxm.user.activeUser.is_admin : false)
  // let userIsLoggedIn = (username) ? (localStorage.getItem('token') || vxm.user.userIsLoggedIn) : false
  // let accountIsActive = vxm.user.activeUser.account_is_active
  // let pageRequiresLogin = to.matched.some(page=> page.meta.requiresAuth)
  // let pageRequiresGuest = to.matched.some(page=> page.meta.onlyGuests)
  // let pageRequiresAdmin = to.matched.some(page=> page.meta.is_admin)
  // let pageRequiresActiveAccount = pageRequiresLogin && to.matched.some(page=> page.meta.requiresActiveAccount)
  
  // // only checking redirects
  // if(userIsLoggedIn && accountIsActive){
  //   if(pageRequiresGuest || (pageRequiresAdmin && !userIsAdmin) || (!pageRequiresActiveAccount && accountIsActive))
  //     redirect = {name:'Todo', params:{username}}
  // }else if(userIsLoggedIn && !accountIsActive){
  //   if(pageRequiresLogin)
  //     redirect = {name:'AccountVerification'}
  // }else if(!userIsLoggedIn){
  //   if(pageRequiresLogin)
  //     redirect = {name:'Login'}
  // }

  // return redirect
}

router.beforeEach((to, from, next)=>{
  next()
  // if(vxm.user.activeUser.id==""){
  //   const watch = vxm.user.$subscribe('setActiveUser', ()=>{
  //     next()
  //   })
  //   next(false)
  //   return
  // }

  // let redirect = checkRedirect(to, from, vxm.user.activeUser)
  // if(redirect){
  //   if(redirect.name == from.name) {
  //     next(false)
  //   } else if(to.name == redirect.name) {
  //     next()
  //   } else{
  //     next(redirect)
  //   }
  // }else{
  //   if(to.name == from.name){
  //     next(false)
  //   }
  //   else{
  //     next()
  //   }
  // }
  
})

export default router;

export const myRoutes = routes