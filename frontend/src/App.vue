<template lang="pug">
  div#app
    Header
    div routes only for testing purposes
      div.flex
        router-link(v-for="r of routes" :key="r" :to="r") {{r}}
    router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from './components/Header.vue';
import axios from 'axios'
import {vxm, User } from './store'
import config from './config'
import {myRoutes} from './router'

@Component({
  components: {
    Header,
  },
})
export default class App extends Vue {
  get routes(){
    return myRoutes.map(r=>r.path.replace(/:\w*/,'santoscaj'))
  }
  
  async beforeCreate(){
    // let token = localStorage.getItem('token')
    // let username = localStorage.getItem('username')
    // try{
    //   if(token){

    //     //@ts-ignore
    //     let activeUser : User = await axios({
    //       method:'get', 
    //       url: config.server.TOKENS_URL,
    //       data:{username, token}
    //       })
    //     vxm.user.setActiveUser(activeUser)
    //   }
    // }catch(e){
    //   console.error(e)
    // }
  }

  async mounted(){
    // try{
    //   let resUsers = await axios.get(config.server.USERS_URL)
    //   vxm.user.setUsers(resUsers.data)
    // }
    // catch(e){
    //   vxm.user.setUsers([])
    //   console.error(e)
    // }
  }

}
</script>

<style lang="sass">
#app 
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  box-sizing: border-box


.flex
  display: flex
  justify-content: space-between
  padding:10px
  border-bottom: 1px solid black

</style>
