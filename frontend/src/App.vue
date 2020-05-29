<template lang="pug">
  div#app
    Layout
      Header
      Layout
        Sider(collapsible :collapsed-width="78" v-model="isCollapsed")
          SideBar(:isCollapsed.sync="isCollapsed")
        Content
          transition(name="slide-left")
            router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from './components/Header.vue';
import SideBar from './components/SideBar.vue';
import axios from 'axios'
import {vxm, User } from './store'
import config from './config'
import {myRoutes} from './router'

@Component({
  components: { Header, SideBar}
})
export default class App extends Vue {
  isCollapsed=false

  get activeUser(){
    return vxm.user.activeUser
  }

  get routes(){
    return myRoutes.map(r=>r.path.replace(/:\w*/,'santoscaj'))
  }
  
  get accountIsActive(){
    return vxm.user.activeUser.account_is_active
  }

  async beforeCreate(){
    let token = localStorage.getItem('token')
    try{
      vxm.user.loadUser(token)
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
