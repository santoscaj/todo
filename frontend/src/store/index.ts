import Vue from 'vue';
import Vuex from 'vuex';
import { createModule, mutation, extractVuexModule, createProxy } from "vuex-class-component";
import emptyUser from '@/utils/emptyUser'
import { TreeChild } from 'view-design';

Vue.use(Vuex);

const VuexModule = createModule({
  namespaced: "user",
  strict: false,
})

export interface Todo{
  id: number;
  title: string;
  content:string;
  user_id: number;
}

export interface User{
  id: number | string;
  username: string;
  password: string;
  email: string;
  is_admin: boolean;
  account_is_active: boolean;
  todos?: Todo[];
  firstName?: string | undefined | null;
  lastName: string | undefined | null;
  image_link?: string;
}

export class MyStore extends VuexModule{
  activeUser : User = emptyUser()
  usertoken :string | null = null

  get userIsLoggedIn(){
    return Boolean(this.usertoken)
  }

  @mutation logout(){
    this.activeUser = emptyUser()
    this.usertoken = null
  }

  @mutation setToken(token: string){
    this.usertoken = token
  }
  
  @mutation setActiveUser(user:User){
    this.activeUser = user
  }

}

export const store = new Vuex.Store({
  modules: {
    ...extractVuexModule( MyStore )
  }
})

export const vxm = {
  user: createProxy( store, MyStore ),
}