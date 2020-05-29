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
        Button( type="error" @click="submitPassword()")  Submit
        div.register
          router-link(:to="{name:'ForgotPassword'}") forgot password?
          p No account? 
            router-link(:to="{name:'Register'}") Sign Up here
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import config from '@/config'
import {vxm} from '@/store'
import axios from 'axios'

@Component
export default class Login extends Vue{
  username = ''
  password = ''

  mounted(){
    window.addEventListener('keydown', (e)=>{
      if(e.which == 13 )
        this.submitPassword()
    })
  }

  async submitPassword(){
    self = this

    if(!self.username|| !self.password)
      return this.$Message.error('Please provide username and password')

    try{
      let response = await axios.post(config.server.LOGIN_URL, {username : self.username, password :self.password})
      let token = response.data.accessToken
      
      let username = response.data.user.username
      let activeUser = response.data.user
      
      vxm.user.setActiveUser(activeUser)
      vxm.user.setToken(token)
      
      localStorage.setItem('token', token)
      localStorage.setItem('username', activeUser.username)
      this.$router.replace( `${config.client.USERS_URL}/${username}/todos`)
    }catch(e){

      if(e.response && (e.response.status == 401 || e.response.status == 404))
        this.$Message.error('Please check username and password')
      else
        this.$Message.error('couldnt login')

      console.error('status',e.response.status)

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
