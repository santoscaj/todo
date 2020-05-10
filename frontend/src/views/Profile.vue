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
        p.label username
        Input(:disabled="!edit" v-model="draftUser.username")
        p.label email
        Input(:disabled="!edit" v-model="draftUser.email")
        p.label First Name
        Input(:disabled="!edit"  v-model="draftUser.firstName")
        p.label Last Name
        Input(:disabled="!edit" v-model="draftUser.lastName")
        p.label Admin priviledges
        Input(:disabled="true" v-model="userIsAdmin")
        p.label Profile Picture
        Input(:disabled="!edit" v-model="draftUser.image_link")
      .password-area
        a.change-password-link(@click="changePassword") change password
        ChangePassword(:showPassword="display" @update:showPassword="updatedPassword($event)")
      Button(type="error" icon="md-trash" size="large" @click="deleteCurrentAccount()") Delete Account
  ErrorPage(v-else :status="status" :statusMessage="statusMessage")
      
</template>

<script>
import {Vue, Component, Watch} from 'vue-property-decorator'
import ChangePassword from '@/components/ChangePassword.vue'
import Welcome from '@/components/Welcome.vue'
import {AxiosGetRequest, AxiosPutRequest} from '@/mixins/axiosRequest'
import Config from '@/config'
import axios from 'axios'
import ErrorPage from '@/components/ErrorPage.vue'
import  { vxm } from '@/store'

function emptyUser(){
  return {
    id: '',
    username: '',
    password: '',
    email: '',
    is_admin: '',
    firstName: '',
    lastName: '',
    image_link: ''
  }
}

@Component({
  components: {ChangePassword, Welcome, ErrorPage},
  mixins: [AxiosGetRequest, AxiosPutRequest]
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

  @Watch('user')
  onUserChange(val){
    this.draftUser = {...this.user}
  }

  async deleteCurrentAccount(){
    let token = vxm.user.usertoken
    let config = {headers:{Authentication: `Bearer ${token}`}}
    let username = this.$route.params.username
    try{
        let response = await axios.delete(`${Config.server.USERS_URL}/${username}`, config)
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
    console.log(usernameChanged, this.user.username, this.draftUser.username)
    let username = this.$route.params.username
    
    try{
      let response = await this.axiosPutRequest(`${Config.server.USERS_URL}/${username}`, this.fieldsToBeUpdated, 'saved successfully')
      if(response){
        vxm.user.setActiveUser(response.data.user)
        this.user = {...this.user, ...response.data.user}
        if(usernameChanged){
          localStorage.setItem('username', response.data.user.username)
          localStorage.setItem('token', response.data.accessToken)
          vxm.user.setToken(response.data.accessToken)
          this.$router.push({name:'Profile', params:{username:response.data.user.username}})
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
    let pageOwner = this.$route.params.username
    let response = await this.axiosGetRequest(Config.server.BASE_SERVER_URL+'/user/'+pageOwner)
    this.user = ( response  && response.data) ? response.data : null
  }

  changePassword(){
    this.display = true
  }

  updatedPassword(x){
    this.display = false
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


.change-password-link
  grid-column: 1 / span 2
</style>
