import Vue from 'vue';
import Vuex from 'vuex';
import { createModule, mutation, extractVuexModule, createProxy, action } from "vuex-class-component";
import emptyUser from '@/utils/emptyUser'
import axios from 'axios'
import config from '@/config'

Vue.use(Vuex);

const VuexModule = createModule({
  namespaced: "user",
  strict: false,
})

export interface TodoItem{
  id: Number | String;
  content: String;
  completed:Boolean;
  todolist_id: Number | String;
}

export interface TodoList{
  id: Number | String;
  name: String;
  user_id: Number | String;
  todoitems: TodoItem[]
}

export interface User{
  id: number | string;
  username: string;
  password: string;
  email: string;
  is_admin: boolean;
  account_is_active: boolean;
  todos?: TodoList[];
  firstName?: string | undefined | null;
  lastName: string | undefined | null;
  image_link?: string;
}

export class MyStore extends VuexModule{
  activeUser : User = emptyUser()
  usertoken :string | null = null
  pageLoaded = false

  get userIsLoggedIn(){
    return Boolean(this.usertoken)
  }

  @mutation checkPageLoader(){
    this.pageLoaded = true
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

  @action async loadUser(token: string | null){
    if(token){
      this.setToken(token)
      let response = await axios.get(config.server.GET_ACTIVE_USER)
      this.setActiveUser(response.data.user)
    }
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