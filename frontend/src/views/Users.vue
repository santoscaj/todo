<template lang="pug">
  div
    Table(:columns="columns" :data="tableData" border disabled- size="small")
      template(slot-scope="{ row, index }" slot="xoxo") 
        div {{row.admin}}
          Switch(v-model="x" @on-change="change")
      template(slot-scope="{ row, index }" slot="action")
        Tooltip(content="Reset user password" placement="top")
          Button.btn( @click="resetPassword(row)" )
            Icon(type="md-refresh")
        Tooltip(content="Delete User" placement="top")
          Button.btn(type="error" @click="deleteUser(row)" )
            Icon(type="ios-trash-outline")
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import { vxm } from '@/store'
import axios from 'axios'
import Config from '@/config'
import AxiosRequest from '@/mixins/axiosRequest'

@Component({
  mixins: [ AxiosRequest ]
})
export default class Users extends Vue{
  status = null
  statusMessage = null
  users = []
  x = true

  deleteUser(row){
    console.log('we have to delete ', row.username)
  }

  resetPassword(row){
    console.log('we have to reset Password of  ', row.username)
  }

  get columns(){
    return [
      {title:'id', key:'id', width: 60}, 
      {title:'username', key:'username'}, 
      {title:'email', key:'email'}, 
      {title:'admin priviledges', slot:"xoxo", key:'admin'}, 
      {title:'action', slot:'action', width: 180, align:'center'}]
  }

  change(){

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
    let response = await this.axiosGetRequest(Config.server.USERS_URL)
    this.users = response.data ? response.data : null
  }
}

</script>

<style lang="sass" scoped>
.btn 
  margin-left: 3px
  margin-right: 3px

</style>
