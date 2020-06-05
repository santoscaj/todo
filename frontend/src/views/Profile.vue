<template lang="pug">
  div(v-if="!errorOccurred")
    Welcome(v-if="firstTime")
    .parent-settings
      .settings
        img.profile-pic(:src="draftUser.image_link" v-if="imageAvailable")
        .mini-header
          Tooltip( content="Edit your info" placement="top" theme="light")
            Button(size="small" v-show="!edit" @click="editUser()" type="warning")
              Icon(type="md-create" )
          Tooltip( content="Discard Changes" placement="top" theme="light")
            Button(size="small" v-show="edit" @click="discardChanges()" type="error")
              Icon(type="md-close")
          Tooltip( content="Save changes" placement="top" theme="light")
            Button(size="small" v-show="edit" @click="saveUser()" type="success")
              Icon(type="md-checkmark")
        .label
          div username
        Input(:disabled="!edit" v-model="draftUser.username")
        .label
          div email
        Input(:disabled="!edit" v-model="draftUser.email")
        .label
          div First Name
        Input(:disabled="!edit"  v-model="draftUser.firstName")
        .label
          div Last Name
        Input(:disabled="!edit" v-model="draftUser.lastName")
        .label
          div Admin priviledges
        Input(:disabled="true" v-model="userIsAdmin")
        .label
          div Profile Picture
        Input(:disabled="!edit" v-model="draftUser.image_link")
      .password-area
        a.change-password-link(@click="changePassword(!display)") change password
        ChangePassword(:display.sync="display")
      .space
      Button.delete-account(type="error" icon="md-trash" size="large" @click="confirmDeletion()") Delete Account
  ErrorPage(v-else :status="status" :statusMessage="statusMessage")
  
</template>

<script>
import {Vue, Component, Watch} from 'vue-property-decorator'
import ChangePassword from '@/components/ChangePassword.vue'
import Welcome from '@/components/Welcome.vue'
import {AxiosGetRequestStatus, AxiosPutRequest, AxiosDeleteRequest} from '@/mixins/axiosRequest'
import config from '@/config'
import axios from 'axios'
import emptyUser from '@/utils/emptyUser'
import ErrorPage from '@/components/ErrorPage.vue'
import  { vxm } from '@/store'
import {socket} from '@/socket'


@Component({
  components: {ChangePassword, Welcome, ErrorPage},
  mixins: [AxiosGetRequestStatus, AxiosPutRequest, AxiosDeleteRequest]
})

export default class Profile extends Vue {
  edit = false
  display = false
  draftUser = emptyUser()
  user = emptyUser()

  get firstTime(){
    return this.$route.meta.firstTime
  }

  get imageAvailable(){
    return Boolean(this.user.image_link)
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
    socket.lockPage({pageName: this.pageName, username})
  }


  @Watch('user')
  onUserChange(val){
    this.draftUser = {...this.user}
  }

  ok(){
  }

  confirmDeletion(){
    this.$Modal.confirm({
      title: 'Delete account',
      content: 'Are you sure you would like to delete the account and all its content?',
      onOk: this.deleteCurrentAccount,
      okText: 'OK',
      cancelText: 'Cancel'
    })
  }

  async deleteCurrentAccount(){
    let username = this.$route.params.username
    try{
        let response = await this.axiosDeleteRequest(config.server.PROFILE_URL,{username})
        this.$Message.success({  content: `user deleted successfully`, duration: 2 })
        this.$router.push({name:'Logout'})
    }catch(err){
        let errorMessage =  ( err.response && err.response.data ) ? err.response.data : err.message
        this.$Message.error({  content: `${errorMessage}`, duration: 3 })
    }
  }
  
  get fieldsToBeUpdated(){
    return {
      username: this.draftUser.username,
      email: this.draftUser.email,
      firstName: this.draftUser.firstName,
      lastName: this.draftUser.lastName,
      image_link: this.draftUser.image_link,
    }
  }

  async saveUser(){
    let usernameChanged = this.user.username != this.draftUser.username 
    let username = this.$route.params.username
    
    try{
      let response = await this.axiosPutRequest(config.server.PROFILE_URL,{username}, this.fieldsToBeUpdated, 'saved successfully')
      if(response){
        vxm.user.setActiveUser(response.data.user)
        this.user = {...this.user, ...response.data.user}
        if(usernameChanged){
          localStorage.setItem('username', response.data.username)
          localStorage.setItem('token', response.data.accessToken)
          vxm.user.setToken(response.data.accessToken)
          this.$router.push({name:'Profile', params:{username:response.data.username}})
        }
        this.edit = false
      }
    }catch(e){
      console.error(e)
    }
    
  }
  discardChanges(){
    this.draftUser = {...this.user}
    this.edit = false
  }

  editUser(){
    this.edit = !this.edit
  }

  get userIsAdmin(){
    return this.user.is_admin? 'enabled' : 'disabled'
  }

  async created(){
    let username = this.$route.params.username
    let response = await this.axiosGetRequest(config.server.PROFILE_URL, {username})
    this.user = ( response  && response.data.user) ? response.data.user : null
  }

  changePassword(display){
    this.display = display
  }
}
</script>

<style lang="sass">
.parent-settings
  max-width: 800px
  border: 1px solid lightgray
  border-radius: 10px
  margin: auto
  padding: 20px
  display: flex
  flex-direction: column
  transition: all 10s ease
  
.settings
  display: grid
  grid-template-columns: 50% 50%
  grid-row-gap: 5px

.mini-header
  grid-column: 1 / span 2
  display: flex
  justify-content: flex-end

.profile-pic
  grid-column: 1 / span 2
  width: 150px
  height: 150px
  margin: auto
  border: 1px solid black

.password-area
  padding: 15px 0

.mini-header>*
  padding: 2px

.space
  flex: 1 1 auto

.label
  padding: 0 10px
  display: flex
  align-items: center 
  justify-content: flex-end

.delete-account
  background: transparent !important
  color: #C80000  !important
  border: 1px solid #C80000  !important
  &:hover
    background: #C80000  !important
    color: white !important

.change-password-link
  grid-column: 1 / span 2
</style>
