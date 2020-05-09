<template lang="pug">
  div
    div.main
      Card.card
        Form(ref="myForm" :model="myForm" :rules="myRules")
          FormItem(label="username" prop="username")
            Input(placeholder="Enter name" v-model="myForm.username")
          FormItem(label="email" prop="email")
            Input(placeholder="E-mail" v-model="myForm.email")
          FormItem(label="Password" prop="password")
            Input(type="password" password v-model="myForm.password")
          FormItem(label="Confirm Password" prop="passwordCheck")
            Input(type="password" password v-model="myForm.passwordCheck")
          FormItem
            Button(@click="handleReset('myForm')" type="primary")  Reset
            Button(@click="handleSubmit()")  Submit
</template>

<script>
import {validatePass, validatePassCheck, validateUnique} from '@/utils/validation'
import  { Component, Vue } from 'vue-property-decorator'
import  { vxm } from '@/store'
import  axios from 'axios'
import  AxiosRequest from '@/mixins/axiosRequest'
import  Config from '@/config'

@Component({
  mixins: [AxiosRequest]
})
export default class Register extends Vue{
  // uniqueFields = {
  //   username : [],
  //   email : []
  // }

  myForm = {
    username: '',
    email: '',
    password: '',
    passwordCheck: ''
  }

  myRules = {
    username: [
      {required:true, message:"username cannot be empty", trigger: 'blur'},
    ],
    email: [
      {required:true, message:"Email cannot be empty", trigger: 'blur'},
      {type:'email', message:"Incorrect email format", trigger: 'blur'},
    ],
    password: [
      { required:true, validator: validatePass(this), trigger: 'blur' }
    ],
    passwordCheck: [
      {validator: validatePassCheck(this), trigger: 'blur' }
    ],
  }

  async created(){
    let response = await this.axiosGetRequest(Config.server.UNIQUE_FIELDS)
    let uniqueFields = response.data
    
    this.myRules.username.push({validator: validateUnique(uniqueFields.username), trigger: 'blur' })
    this.myRules.email.push({validator: validateUnique(uniqueFields.email), trigger: 'blur' })
  }

  async handleSubmit(){
    try{
      let data = {
        username:this.myForm.username,
        email:this.myForm.email,
        password:this.myForm.password
      }
      let response = await axios.post(Config.server.REGISTER_URL, data)
      let token = response.data.accessToken
      let user = response.data.user
      vxm.user.setActiveUser(user)
      vxm.user.setToken(token)
      localStorage.setItem('token',token)
      localStorage.setItem('username', user.username)
      this.$router.replace({name:'Profile', params:{username:user.username}})
    }catch(e){
      console.error(e)
      this.$Message.error('There was an error adding user')
    }
  }

  handleReset(name){
    this.$refs[name].resetFields()
  }

}
</script>

<style lang="sass" scoped>
.main
  display: flex
  justify-content: center

.card
  width: 300px
</style>
