<template lang="pug">
  div(v-if="!errorOccurred")
    Table(:columns="columns" :data="tableData" border disabled- size="small")
      template(slot-scope="{ row, index }" slot="xoxo") 
        div {{row.admin}}
      template( slot="action")
        Button(slot-scope="{ row, index }" ) 
          p is
        Tooltip(slot-scope="{ row, index }" content="remove from admin group" placement="top" v-if="index==2" )
          Button(slot-scope="{ row, index }" size="small" type="warning" @click="removeFromAdmin(row)" ) 
            Icon(type="md-remove-circle")
        Tooltip( slot-scope="{ row, index }" content="Add to admin group" placement="top" v-if="index==2" )
          Button(slot-scope="{ row, index }" size="small" type="success" @click="addToAdmin(row)" )
            Icon(type="md-person-add")
        Tooltip(content="Reset user password" placement="top")
          Button(size="small"  @click="resetPassword(row)" )
            Icon(type="md-refresh")
        Tooltip(content="Delete User" placement="top")
          Button(size="small" type="error" slot-scope="{ row, index }" @click="deleteUser(row)" )
            Icon(type="ios-trash-outline")
  ErrorPage(v-else :status="status" :statusMessage="statusMessage")

</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import { vxm } from '@/store'
import axios from 'axios'
import Config from '@/config'
import AxiosRequest from '@/mixins/axiosRequest'
import ErrorPage from '@/components/ErrorPage.vue'

@Component({
  components: {ErrorPage},
  mixins: [ AxiosRequest ]
})
export default class Users extends Vue{
  status = null
  statusMessage = null
  users = []
  x = true

  async deleteUser(row){
    let token = vxm.user.usertoken
    let config = {headers:{Authentication: `Bearer ${token}`}}
    let username = row.username
    try{
        let response = await axios.delete(`${Config.server.USERS_URL}/${username}`, config)
        this.reloadPage()
        console.dir(response)
        this.$Message.success({  content: `user deleted successfully`, duration: 2 })
    }catch(err){
        let errorMessage =  ( err.response && err.response.data ) ? err.response.data : err.message
        this.$Message.error({  content: `${errorMessage}`, duration: 3 })
    }
  }

  resetPassword(row){
    console.log('we have to reset Password of  ', row.username)
  }

  get columns(){
    return [
      {title:'id', key:'id', width: 60}, 
      {title:'username', key:'username'}, 
      {title:'email', key:'email'}, 
      {title:'admin priviledges', key:'admin'}, 
      {title:'user options', slot:'action', width: 200, align:'center'}]
  }

  addToAdmin(){}
  removeFromAdmin(){}

  change(){
    this.reloadPage()
  }

  get tableData(){
    return this.users? this.users.map(obj=>{
      return {
        id: obj.id,
        username: obj.username, 
        email: obj.email, 
        admin: obj.is_admin === true? 'enabled': 'disabled'
      }
    }) : []
  }

  async reloadPage(){
    let response = await this.axiosGetRequest(Config.server.USERS_URL)
    this.users = ( response  && response.data) ? response.data : null
  }

  async created(){
    this.reloadPage()
  }
}

</script>

<style lang="sass" scoped>
.ivu-btn
  margin-left: 3px
  margin-right: 3px
  border: 1px solid gray
  background: white
  color: black

</style>
