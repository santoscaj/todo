<template lang="pug">
  div
    div.settings
      img.profile-pic(:src="user.image_link")
      div.mini-header
        Button(v-show="!edit" @click="edit = true" type="warning")
          Icon(type="md-create" )
        Button(v-show="edit" @click="edit = false" type="error")
          Icon(type="md-close")
        Button(v-show="edit" @click="edit = false" type="success")
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
    a(@click="changePassword") change password
    ChangePassword.password-area(:showPassword="display" @update:showPassword="updatedPassword($event)")
      
</template>

<script>
import {Vue, Component} from 'vue-property-decorator'
import ChangePassword from '@/components/ChangePassword.vue'
import axiosRequest from '@/mixins/axiosRequest'
import Config from '@/config'
import axios from 'axios'

@Component({
  components: {ChangePassword},
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

  get userIsAdmin(){
    return this.user.is_admin? 'enabled' : 'disabled'
  }

  async created(){
    let pageOwner = this.$route.params.username
    let response = await this.axiosGetRequest(Config.server.BASE_SERVER_URL+'/user/'+pageOwner)
    this.user = response.data ? response.data : null
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
.settings
  width: 800px
  margin: auto
  left: 50%

  display: grid
  grid-template-columns: 50% 50%
  grid-row-gap: 5px

.mini-header
  grid-column: 1 / span 2
  display: flex
  justify-content: flex-end

.password-area
  z-index: -1

.profile-pic
  grid-column: 1 / span 2
  width: 150px
  height: 150px
  margin: auto
  border: 1px solid black
</style>
