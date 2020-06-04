import Vue from 'vue';
import Vuex from 'vuex';
import { createModule, mutation, extractVuexModule, createProxy, action } from "vuex-class-component";
import emptyUser from '@/utils/emptyUser'
import axios from 'axios'
import config from '@/config'
import Socket from '@/socket'
// const socket = io(config.server.BASE_SERVER_URL)

// socket.on('connect', ( data )=>{
//   console.log('connected')
// }) 

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
  socket = new Socket()
  activeUser : User = emptyUser()
  usertoken :string | null = null
  pageLoaded = false
  sessionId: string | number | null = null

  get userIsLoggedIn(){
    return !!this.activeUser.id
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

  @mutation setSessionId(sessionId: string|number){
    this.sessionId = sessionId
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

  @action async setUpSessionId(sessionId: string | null){
    if(sessionId){
      // this.setSessionId(sessionId)
      // let response = await axios.get(config.server.GET_ACTIVE_USER)
      // this.setActiveUser(response.data.user)
    }else{
      let response = await axios.get('/session')
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