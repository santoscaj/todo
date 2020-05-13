<template lang="pug">
  div(v-if="!errorOccurred")
    Table(:columns="columns" :data="tableData" border disabled- size="small")
      template(slot-scope="{ row, index }" slot="admin") 
        div {{row.admin}}
      template(slot-scope="{ row, index }" slot="enabled") 
        div {{row.enabled}}
      template( slot="options" slot-scope="{ row, index }")
        Tooltip( v-if="row.account_is_active && row.is_admin" content="remove from admin group" placement="top" )
          Button(size="small" type="warning" @click="changeAdminStatus(row)" ) 
            Icon(type="md-remove-circle")
        Tooltip(v-if="row.account_is_active && !row.is_admin" content="add to admin group" placement="top" )
          Button(size="small" type="success" @click="changeAdminStatus(row)") 
            Icon(type="md-person-add")
        Tooltip(v-if="!row.account_is_active" content="send activation email" placement="top" )
          Button(size="small" type="primary" @click="sendVerificationEmail(row)") 
            Icon(type="md-paper-plane")
        Tooltip(content="Reset user password" placement="top")
          Button(size="small"  @click="resetPassword(row)" )
            Icon(type="md-refresh")
        Tooltip(content="Delete User" placement="top")
          Button(size="small" type="error"  @click="deleteUser(row)" )
            Icon(type="ios-trash-outline")
  ErrorPage(v-else :status="status" :statusMessage="statusMessage")

</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import { vxm } from '@/store'
import axios from 'axios'
import Config from '@/config'
import {AxiosGetRequest, AxiosPutRequest} from '@/mixins/axiosRequest'
import ErrorPage from '@/components/ErrorPage.vue'

@Component({
  components: {ErrorPage},
  mixins: [ AxiosGetRequest, AxiosPutRequest ]
})
export default class Users extends Vue{
  status = null
  statusMessage = null
  users = []
  x = true

  async deleteUser(row){
    // let token = vxm.user.usertoken
    // let config = {headers:{Authentication: `Bearer ${token}`}}
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


  get columns(){
    return [
      {title:'id', key:'id', width: 60}, 
      {title:'username', key:'username'}, 
      {title:'email', key:'email'}, 
      {title:'admin priviledges', key:'admin'}, 
      {title:'account status', key:'enabled'}, 
      {title:'user options', slot:'options', width: 200, align:'center'}]
  }

  async updateUser(user, username){
    let response = await this.axiosPutRequest(`${Config.server.USERS_URL}/${username}`, user)
    return 
    axios.put(this.user)
    this.reloadPage()
  }

  changeAdminStatus(row){
    let is_admin = !row.is_admin
    this.updateUser({is_admin}, row.username)
  }

  resetPassword(row){ }
  sendVerificationEmail(row){ }


  change(){
    this.reloadPage()
  }

  get tableData(){
    return (this.users && this.users.length >0 )? this.users.map(obj=>{
      return {
        id: obj.id,
        username: obj.username, 
        email: obj.email, 
        admin: obj.is_admin === true? 'enabled': 'disabled',
        enabled: obj.account_is_active === true? 'active': 'inactive',
        is_admin: obj.is_admin,
        account_is_active: obj.account_is_active
      }
    }) : []
  }

  async reloadPage(){
    let response = await this.axiosGetRequest(Config.server.USERS_URL)
    this.users = ( response  && response.data) ? [...this.users, ...response.data ] : null
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

.ivu-btn-success:hover
  background: green

.ivu-btn-warning:hover
  background: orange

.ivu-btn-error:hover
  background: red

.ivu-btn-default:hover
  background: lightblue
  color: white

.ivu-table-wrapper, .ivu-table-small, .ivu-table-tbody, .ivu-table-row
  font-size: 5px !important
  line-height: 1.3 !important

</style>
