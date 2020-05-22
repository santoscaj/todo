import Vue from 'vue';
import VueRouter, { RouteConfig, Route } from 'vue-router';
import Home from '../views/Home.vue';
import Todos from '../views/Todos.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Users from '../views/Users.vue';
import Profile from '../views/Profile.vue';
import PageNotFound from '../views/PageNotFound.vue';
import AccountVerification from '../views/AccountVerification.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
// import myVue from '@/main'
import {vxm, User} from '@/store'
// import { getNamespacedPath } from 'vuex-class-component/dist/module';
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

function checkRedirect(to : Route, from: Route, user: User | null){
  let redirect = null

  let pageRequiresLogin = to.matched.some(page=> page.meta.requiresAuth)
  let pageRequiresGuest = to.matched.some(page=> page.meta.onlyGuests)
  let pageRequiresAdmin = to.matched.some(page=> page.meta.is_admin)
  let pageRequiresActiveAccount = pageRequiresLogin && to.matched.some(page=> page.meta.requiresActiveAccount)
  let username = user? user.username : ''
  let userIsAdmin = user? user.is_admin : ''
  let accountIsActive = user ? user.account_is_active : ''

  if(user && accountIsActive){
    if(pageRequiresGuest || (pageRequiresAdmin && !userIsAdmin) || (!pageRequiresActiveAccount && accountIsActive))
      redirect = {name:'Todos', params:{username}}
  }else if(user && !accountIsActive)
      if(pageRequiresGuest || pageRequiresLogin)
        redirect = {name:'AccountVerification'}
  else if(!user && pageRequiresLogin)
      redirect = {name:'Login'}

  return redirect
}

interface Redirect{
  name: string;
  params?: {username:string}
}

function routerGo(redirect:Redirect | null, to:Route, from:Route, next: Function){
  
  if(redirect){
    if(redirect.name == from.name) {
      next(false)
    } else if(to.name == redirect.name) {
      next()
    } else{
      next(redirect)
    }
  }else{
    if(to.name == from.name){
      next(false)
    }
    else{
      next()
    }
  }
}

function goToNextPage(user:User | null, to:Route, from:Route, next:Function){
  let redirect = checkRedirect(to, from, user)
  routerGo(redirect, to, from, next)
}

router.beforeEach((to, from, next)=>{
  next()

  let activeUser = vxm.user.activeUser.id? vxm.user.activeUser : null

  if( !activeUser && !vxm.user.pageLoaded){
        const watch = vxm.user.$subscribe('setActiveUser', ()=>{
        let activeUser = vxm.user.activeUser
        goToNextPage(activeUser, to, from, next)
    })
    next(false)
    return
  }else{
    goToNextPage(activeUser, to, from, next)
  }
})

export default router;

export const myRoutes = routes