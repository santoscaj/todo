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
import config from '@/config'
import {AxiosGetRequestStatus, AxiosPutRequest, AxiosDeleteRequest} from '@/mixins/axiosRequest'
import ErrorPage from '@/components/ErrorPage.vue'
import {socket} from '@/socket'


@Component({
  components: {ErrorPage},
  mixins: [ AxiosGetRequestStatus, AxiosPutRequest, AxiosDeleteRequest ]
})
export default class Users extends Vue{
  users = []
  x = true

  async deleteUser(row){
    let username = row.username
    try{
        let response = await this.axiosDeleteRequest(config.server.PROFILE_URL, {username})
        this.reloadPage()
        console.dir(response)
        this.$Message.success({  content: `user deleted successfully`, duration: 2 })
    }catch(err){
        console.error(err)
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
    let response = await this.axiosPutRequest(config.server.PROFILE_URL, {username}, user)
    let updatedUser = response.data
    let index = this.users.findIndex(u=>u.id == updatedUser.id)
    this.users.splice(index, 1, updatedUser)
  }

  changeAdminStatus(row){
    let is_admin = !row.is_admin
    this.updateUser({is_admin}, row.username)
  }

  resetPassword(row){ }
  sendVerificationEmail(row){ }

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
    let response = await this.axiosGetRequest(config.server.USERS_URL)
    this.users = ( response  && response.data) ? response.data : null
  }

  async created(){
    this.reloadPage()
  }
  
  get pageName(){
    let routeName = this.$route.name
    let nameDividedByChild = routeName.split('-')
    let pageName = nameDividedByChild[0]
    return pageName
  }

  mounted(){
    if(!vxm.user.userIsLoggedIn)
      throw 'cannot lock page, no active user'
    let username = vxm.user.activeUser.username
    socket.lockPage(this.pageName, username)
  }

  change(){
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
