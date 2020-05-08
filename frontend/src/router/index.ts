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
Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login, // () => import('../views/Login.vue'),
    meta:{
      guest: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component:Register, // () => import('../views/Register.vue'),
    meta:{
      guest: true
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
      pageTitle: 'User Settings'
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next)=>{
      localStorage.clear()
      vxm.user.logout()
      next('/login')
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

router.beforeEach((to, from, next)=>{
  if(to.matched.some(page=> page.meta.requiresAuth)){
    if(localStorage.getItem('token'))
      next()
    else{
      if(from.path == '/login')
        next(false)
      next({path:'/login'})
    }
  }else{
    next()
  }

  return 
  
})

export default router;

export const myRoutes = routes