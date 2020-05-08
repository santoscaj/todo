<template lang="pug">
  div(v-if="!errorOccurred")
    .parent-settings
      .settings
        img.profile-pic(:src="user.image_link")
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
        Input(:disabled="!edit" v-model="user.username")
        p.label email
        Input(:disabled="!edit" v-model="user.email")
        p.label First Name
        Input(:disabled="!edit"  v-model="user.firstName")
        p.label Last Name
        Input(:disabled="!edit" v-model="user.lastName")
        p.label Admin priviledges
        Input(:disabled="true" v-model="userIsAdmin")
        p.label Profile Picture
        Input(:disabled="!edit" v-model="user.image_link")
      .password-area
        a.change-password-link(@click="changePassword") change password
        ChangePassword(:showPassword="display" @update:showPassword="updatedPassword($event)")
      Button(type="error" icon="md-trash" size="large" @click="deleteCurrentAccount()") Delete Account
  ErrorPage(v-else :status="status" :statusMessage="statusMessage")
      
</template>

<script>
import {Vue, Component} from 'vue-property-decorator'
import ChangePassword from '@/components/ChangePassword.vue'
import axiosRequest from '@/mixins/axiosRequest'
import Config from '@/config'
import axios from 'axios'
import ErrorPage from '@/components/ErrorPage.vue'

@Component({
  components: {ChangePassword, ErrorPage},
  mixins: [axiosRequest]
})
export default class Profile extends Vue {
  edit = false
  display = false
  user = null

  user = {
    id: '',
    username: '',
    password: '',
    email: '',
    is_admin: '',
    firstName: '',
    lastName: '',
    image_link: ''
  }

  deleteCurrentAccount(){}
  saveUser(){
    this.edit=false
  }
  discardChanges(){}
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
