<template lang="pug">
  div
    h3 This is admin users page
    Table(:columns="columns" :data="tableData" border disabled- size="small")
      template(slot-scope="{ row, index }" slot="action")
        Tooltip(content="Reset user password" placement="top")
          Button.btn()
            Icon(type="md-refresh")
        Tooltip(content="Delete User" placement="top")
          Button.btn(type="error") 
            Icon(type="ios-trash-outline")

</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import { vxm } from '@/store'
import axios from 'axios'
import Config from '@/config'

@Component
export default class Login extends Vue{
  users = []

  get columns(){
    return [
      {title:'id', key:'id', width: 60}, 
      {title:'username', key:'username'}, 
      {title:'email', key:'email'}, 
      {title:'admin priviledges', key:'admin'}, 
      {title:'action', slot:'action', width: 180, align:'center'}]
  }

  get tableData(){
    return this.users.map(obj=>{
      return {
        id: obj.id,
        username: obj.username, 
        email: obj.email, 
        admin: obj.is_admin === true? 'enabled': 'disabled'
      }
    })
  }

  async created(){
    let token = vxm.user.usertoken
    try{
      let response = await axios.get(Config.server.USERS_URL)
      let users = response.data
      console.log(users)
    }catch(e){
      console.error(e)
    }

  }
}



</script>

<style lang="sass" scoped>
.btn 
  margin-left: 3px
  margin-right: 3px

</style>
