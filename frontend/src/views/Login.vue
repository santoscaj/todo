<template lang="pug">
  div
    h3 This is login page
    div.main
      Card.card
        Form
          FormItem(label="username")
            Input(prefix="ios-contact" placeholder="Enter name" v-model="username")
          FormItem(label="password")
            Input(type="password" password v-model="password")
        Button(type="error" @click="submitPassword()")  Submit
        div.register
          a forgot password
          p No account? 
            a Sign Up here
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import config from '@/config.js'
import {vxm} from '@/store'
import axios from 'axios'

@Component
export default class Login extends Vue{
  username = ''
  password = ''

  async submitPassword(){
    self = this
    try{
      let response = await axios.post(config.server.LOGIN_URL, {username : self.username, password :self.password})
      let token = response.data.accessToken
      let username = response.data.user.username
      let activeUser = response.data.user
      
      vxm.user.setActiveUser(activeUser)
      vxm.user.setToken(token)
      
      localStorage.setItem('token', token)
      this.$router.replace( `${config.client.USERS_URL}/${username}/todos`)
    }catch(e){
      console.error(e)
    }
  }

}

</script>

<style lang="sass" scoped>
.main
  display: flex
  justify-content: center

.card
  width: 300px

.register
  margin: 8px
  padding: 5px
  font-size: 11px

</style>
