import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const ADMIN_REQUIRED_ROUTES : string[] = ['Users']
const LOGIN_REQUIRED_ROUTES : string[] = [...ADMIN_REQUIRED_ROUTES, 'Todos','Profile']
const LOGIN_AND_REGISTER_ROUTES : string[] = ['Login', 'Register', 'ForgotPassword']

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
  },
  {
    path: '/users/:username/todos',
    name: 'Todos',
    component: () => import('../views/Todos.vue'),
  },
  {
    path: '/users/:username',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: () => import('../views/PageNotFound.vue'),
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
  next()
  return 
  if(LOGIN_REQUIRED_ROUTES.includes(to.name!) && !logged_in)
    next()
  else if(ADMIN_REQUIRED_ROUTES.includes(to.name!) && !admin_user)
    next(false)
  else 
    next()

})

export default router;

export const myRoutes = routes