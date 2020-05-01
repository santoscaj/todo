import Vue from 'vue';
import Vuex from 'vuex';
import { createModule, mutation, extractVuexModule, createProxy } from "vuex-class-component";

Vue.use(Vuex);

const VuexModule = createModule({
  namespaced: "user",
  strict: false,
})

interface Todo{
  id: number;
  title: string;
  content:string;
  user_id: number;
}

interface User{
  id: number | string;
  username: string;
  password: string;
  email: string;
  is_admin: boolean;
  todos?: Todo[];
  firstName?: string | undefined | null;
  lastName: string | undefined | null;
}

export class MyStore extends VuexModule{
  users = []
  
  get getUserTodos(){
    const self = this
    return function(username: string){
      return self.users
      .filter((u:User)=>u.username === username)
      .map((u:User)=>u.todos)[0]
    }
  }  

  @mutation setUsers(data : any){
    this.users = data
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