import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Todos from '../views/Todos.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Users from '../views/Users.vue';
import Profile from '../views/Profile.vue';
import PageNotFound from '../views/PageNotFound.vue';
import Logout from '../views/Logout.vue';
// import myVue from '@/main'
import {vxm } from '@/store'
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
      pageTitle: 'User to-do lists'
    }
  },
  {
    path: '/users/:username',
    name: 'Profile',
    component: Profile, // () => import('../views/Profile.vue'),
    meta:{
      requiresAuth: true,
      pageTitle: 'User Settings',
      firstTime: false
    },
    // check afterEach router configuration below 
    beforeEnter: (to, from, next)=>{
      let username = from.params.username || localStorage.getItem('username')
      if(!username)
        next({name:'Login'})
      else if(username && from.name=='Register'){
        to.meta.firstTime = true
        next()
      }else 
        next()
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

router.beforeEach((to, from, next)=>{
  let username = localStorage.getItem('username') || ((vxm.user.activeUser) ? vxm.user.activeUser.username : '')
  let userIsLoggedIn = (username) ? (localStorage.getItem('token') || vxm.user.userIsLoggedIn) : false

  if(to.matched.some(page=> page.meta.requiresAuth)){
    if(userIsLoggedIn)
      next()
    else{
      if(from.name == 'Login')
        next(false)
    next({name:'Login'})
    }
  }else if(to.matched.some(page=>page.meta.onlyGuests)){
    if(userIsLoggedIn){
      next({name:'Todos', params: {username}})
    }
    else
      next()
  }else{
    next()
  }

  return 
  
})

export default router;

export const myRoutes = routes