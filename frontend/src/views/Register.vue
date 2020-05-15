<template lang="pug">
  div
    div.main
      .back
        Button(icon="ios-arrow-back" size="small" @click="goToLogin()") Back to login
      Card.card
        Form(ref="myForm" :model="myForm" :rules="myRules")
          FormItem(label="username" prop="username")
            Input(placeholder="Enter name" v-model="myForm.username" @input="checkValidUsername()")
          FormItem(label="email" prop="email")
            Input(placeholder="E-mail" v-model="myForm.email" @input="checkValidEmail()")
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
import  {AxiosGetRequestStatus, AxiosGetRequest} from '@/mixins/axiosRequest'
import  config from '@/config'

@Component({
  mixins: [AxiosGetRequestStatus, AxiosGetRequest]
})

export default class Register extends Vue{
  myForm = {
    username: '',
    email: '',
    password: '',
    passwordCheck: ''
  }

  urls={
    username : config.server.CHECK_USER,
    email : config.server.CHECK_EMAIL
  }

  // items(per field) that have been checked in the server
  validatedItems = {
    username : [],
    email : []
  }

  // items(per field) that already exist in the database
  uniqueItems={
    username : [],
    email : []
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

  addValueToRuleset(field, value){
    this.uniqueItems[field].push(value)
    let ruleset = this.myRules[field]
    let index = ruleset.findIndex(validation=>validation.ref == 'uniqueValidator')
    if(index<0)
      this.myRules[field].push({validator: validateUnique(this.uniqueItems[field], field), trigger: 'blur', ref:'uniqueValidator'})
    else
      this.myRules[field].splice(index, 1, {validator: validateUnique(this.uniqueItems[field], field), trigger: 'blur', ref:'uniqueValidator'})
  }

  checkUniqueFieldsDebounce(field){
    let timeout = 0
    return async ()=>{
      let valueToValidate = this.myForm[field]
      clearTimeout(timeout)
      if(!this.validatedItems[field].includes(valueToValidate) && valueToValidate!='')
        timeout = setTimeout(async ()=>{
          try{
            let config = {}
            config[field] = valueToValidate
            let response = await this.axiosGetRequest(this.urls[field], config)
            if(response.data.result)
              this.addValueToRuleset(field,valueToValidate)
            this.validatedItems[field].push(valueToValidate)
          }catch(e){
            console.error(e)
          }
        },600)
    }
  }

  checkValidUsername = this.checkUniqueFieldsDebounce('username')
  checkValidEmail = this.checkUniqueFieldsDebounce('email')

  async handleSubmit(){
    try{
      let data = {
        username:this.myForm.username,
        email:this.myForm.email,
        password:this.myForm.password
      }
      let response = await axios.post(config.server.REGISTER_URL, data)
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

  goToLogin(){
    this.$router.push({name:'Login'})
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
  flex-direction: column
  align-items: center

.card
  width: 300px

.back
  display: flex
  width: 300px
  .ivu-btn
    background: transparent
    border: 1px solid transparent
    font-size:12px
    margin: 5px
    &:hover
      border: 1px solid #007EA7
      color: #007EA7
    

</style>
