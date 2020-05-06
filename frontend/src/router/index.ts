import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Todos from '../views/Todos.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Users from '../views/Users.vue';
import Profile from '../views/Profile.vue';
import PageNotFound from '../views/PageNotFound.vue';

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
    path: '/management/users/',
    name: 'Users',
    component:Users, // () => import('../views/Users.vue'),
    meta:{
      requiresAuth: true,
      is_admin: true
    }
  },
  {
    path: '/users/:username/todos',
    name: 'Todos',
    component: Todos,// () => import('../views/Todos.vue'),
    meta:{
      requiresAuth: true,
    }
  },
  {
    path: '/users/:username',
    name: 'Profile',
    component: Profile, // () => import('../views/Profile.vue'),
    meta:{
      requiresAuth: true,
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

let logged_in = true
let admin_user = false

router.beforeEach((to, from, next)=>{
  // console.log('printing to: ',to)
  next()
  return 
  
})

export default router;

export const myRoutes = routes