<template lang="pug">
  div#app
    Layout
      Header
      Layout
        Sider
          transition-group(name="slide-right")
            router-link.side-link(:to="{name: 'Todos', params: {username: activeUser.username }}" v-if="login" key="todos") 
              Icon(type="md-clipboard") 
              span Todos
            router-link.side-link(:to="{name: 'Users'}" :disabled="!activeUser.is_admin" v-if="login" key="management") 
              Icon(type="md-people") 
              span Management
            router-link.side-link(:to="{name: 'Profile', params: {username: activeUser.username }}" v-if="login" key="profile") 
              Icon(type="md-person") 
              span Profile
        Content
          transition(name="slide-left")
            router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from './components/Header.vue';
import axios from 'axios'
import {vxm, User } from './store'
import Config from './config'
import {myRoutes} from './router'

@Component({
  components: { Header }
})
export default class App extends Vue {
  get activeUser(){
    return vxm.user.activeUser
  }

  get login(){
    return Boolean(vxm.user.usertoken)
  }

  get routes(){
    return myRoutes.map(r=>r.path.replace(/:\w*/,'santoscaj'))
  }
  
  async beforeCreate(){
    let token = localStorage.getItem('token')
    if(token){
      vxm.user.setToken(token)
      try{
        let config = {headers: {Authentication: `Bearer ${token}` } }
        let response = await axios.get(Config.server.GET_ACTIVE_USER, config)
        vxm.user.setActiveUser(response.data)
      }catch(e){
        console.error(e)
        this.$router.push('/logout')
      }
    }
  }
}
</script>

<style lang="sass">


html,body
  width: 100% 
  height: 100%

body 
  overflow-x: hidden

#app 
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  box-sizing: border-box
  height:100%
  
.ivu-layout
  height:100%

.ivu-layout-sider
  background: #0d1821d1 !important 
  background: #0D1821 !important 
  background: #0d1821f5 !important 
  overflow: hidden

.ivu-layout-header
  background: #72b01d !important
  background: #bfdbf7 !important
  background: #92140cd9 !important
  background: #007ea7 !important
  color: #bfdbf7
  padding: 0 !important
  display: flex !important
  justify-content: flex-end !important
  height: 40px !important
  align-items: center !important
  line-height: unset !important
  user-select: none
  &>*
    margin-left: 8px

.side-link
  display: block
  width: 100%
  height: 30px
  line-height: 30px
  font-size: 9.5px
  color: #eef0f2
  font-family: 'Sarpanch', sans-serif
  text-align: left
  transition: all .8s ease
  &:hover
    margin-left: 12px

  &>.ivu-icon
    margin: 0 10px 0 15px

  &:hover
    background:  rgb(0,0,0,0.1)
    color: lightgray

.flex
  display: flex
  justify-content: space-between
  padding:10px
  border-bottom: 1px solid black

.ivu-layout-content
  font-size: 11px
  padding: 40px

.slide-left-enter-active 
  transition: all .2s ease .3s 

.slide-left-leave-active 
  transition: all .1s cubic-bezier(1.0, 0.3, 0.5, 1.0)

.slide-left-enter, .slide-left-leave-to
  display: none



// .slide-right-enter-active 
//   transition: all .2s ease

// .slide-right-leave-active 
//   transition: translateX(10px)


</style>
