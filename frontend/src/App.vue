<template lang="pug">
  div#app
    Layout
      Header
      Layout
        Sider(collapsible :collapsed-width="78" v-model="isCollapsed")
          SideBar(:isCollapsed.sync="isCollapsed")
        Content(style="position:relative")
          transition(name="slide-left")
            router-view
          .block.login(v-if="false")
            .message 
              p This page is being edited on a different session.
              p Please wait until editing is complete 
                span.typing#dot1 .
                span.typing#dot2 .
                span.typing#dot3 .
        .block.session(v-if="duplicateSession")
          .message 
            p You have logged in from a different computer.
            p Please refresh to log back in
              span.typing#dot1 .
              span.typing#dot2 .
              span.typing#dot3 .


</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Header from './components/Header.vue';
import SideBar from './components/SideBar.vue';
import axios from 'axios'
import {vxm, User } from './store'
import config from './config'
import {myRoutes} from './router'

// console.log(socket)

@Component({
  components: { Header, SideBar}
})
export default class App extends Vue {
  isCollapsed=false

  get connected(){
    //@ts-ignore
    return this.socket.isConnected
  }
  get duplicateSession(){
    //@ts-ignore
    return this.socket.isDuplicate
  }

  get activeUser(){
    return vxm.user.activeUser
  }

  get routes(){
    return myRoutes.map(r=>r.path.replace(/:\w*/,'santoscaj'))
  }
  
  get accountIsActive(){
    return vxm.user.activeUser.account_is_active
  }

  connectSocket(token : string){
    let {id, username, email} = vxm.user.activeUser
    this['socket'].login({id, username, email, token})
  }

  async beforeCreate(){
    let token = localStorage.getItem('token')
    let sessionId = localStorage.getItem('sessionId')
    try{
      vxm.user.loadUser(token)
      this.$nextTick()
      if(vxm.user.userIsLoggedIn && token)
        this.connectSocket(token)
    }catch(e){
      console.error(e)
      this.$router.push('/logout')
    }
    vxm.user.checkPageLoader()

  }
}
</script>

<style lang="sass">
:root
  --header-size: 40px
  --card-width: 220px
  --card-height: 240px

html,body
  width: 100% 
  height: 100%

body 
  overflow-x: hidden

#app 
  font-family: Avenir, Helvetica, Arial, sans-serifx
  font-family: 'Open Sans', sans-serifs
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
  background: white !important
  border-bottom: 1px solid #007ea7
  color: #bfdbf7
  padding: 0 !important
  display: flex !important
  justify-content: flex-end !important
  height: var(--header-size) !important
  align-items: center !important
  line-height: unset !important
  user-select: none
  &>*
    margin-left: 8px

.block
  position: absolute
  background: rgb(0,0,0,0.2)
  display: flex
  justify-content: center
  align-items: center

  top: 0
  bottom: 0
  left: 0
  right: 0
  // width: 100%
  // height: calc(100vh - var(--header-size))

  .message
    padding: 5px
    background: rgb(255,255,255,0.8)
    font-size: 12px
    border-radius: 5px

.typing
  animation-name: dots
  animation-duration: 2s
  animation-iteration-count: infinite
  animation-timing-function: ease-in-out
  opacity: 0

@keyframes dots
  10%
    opacity: 1

#dot2
  animation-delay: .3s

#dot3
  animation-delay: 0.6s

.flex
  display: flex
  justify-content: space-between
  padding:10px
  border-bottom: 1px solid black

.ivu-layout-content, .ivu-input
  font-size: 11px !important
  padding: 40px
  height: auto !important
  max-height: calc(100vh - var(--header-size)) !important

.slide-left-enter-active 
  transition: all .2s ease .3s 

.slide-left-leave-active 
  transition: all .1s cubic-bezier(1.0, 0.3, 0.5, 1.0)

.slide-left-enter, .slide-left-leave-to
  display: none

.ivu-layout-sider-trigger
  background: transparent !important 

</style>
