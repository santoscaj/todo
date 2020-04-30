<template lang="pug">
  div
    h3 This is register page
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
            Button(@click="handleSubmit()" type="primary")  Reset
            Button(@click="handleReset('myForm')")  Submit
</template>

<script>
import {validatePass, validatePassCheck} from '@/utils/validation'
import  { Component, Vue } from 'vue-property-decorator'

@Component
export default class Register extends Vue{
  myForm = {
    username: '',
    email: '',
    password: '',
    passwordCheck: ''
  }

  myRules = {
    username: [
      {required:true, message:"username cannot be empty", trigger: 'blur'}
    ],
    email: [
      {required:true, message:"Email cannot be empty", trigger: 'blur'},
      {type:'email', message:"Incorrect email format", trigger: 'blur'}
    ],
    password: [
      { required:true, validator: validatePass(this), trigger: 'blur' }
    ],
    passwordCheck: [
      { required:true,validator: validatePassCheck(this), trigger: 'blur' }
    ],
  }

  handleSubmit(){

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
