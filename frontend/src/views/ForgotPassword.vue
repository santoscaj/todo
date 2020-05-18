<template lang="pug">
    .verification-area
        .back
            Button(icon="ios-arrow-back" size="small" @click="goToLogin()") Back to login
        .verification-box
            p Please enter your email address below to send temporary password.
            Input.verification-input(v-model="email", type="email")
            Button.verification-btn(icon="md-send" @click="sendPassword()") Send
</template>


<script>
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import { AxiosPostRequest } from '@/mixins/axiosRequest'
import config from '@/config'

@Component({mixins:[AxiosPostRequest]})
export default class ErrorMessage extends Vue{

  goToLogin(){
    this.$router.push({name:'Login'})
  }
    email=''
  sendPassword(){
    if(!this.email)
        return this.$Message.error('Please provide email address')
    if(!/.+@.+\..+/.test(this.email))
        return this.$Message.error('Please enter valid email')
    try{
        this.axiosPostRequest(config.server.RESET_PASSWORD, {email:this.email})
    }catch(e){
        console.error(e)
    }
}
}
</script>

<style lang="sass">
.verification-area
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    width: 100%
    height: 100%

    .verification-box
        padding: 20px
        display: flex
        justify-content: center
        flex-direction: column
        align-items: center
        border: 1px solid black
        background: white
        width: 300px
        height: 150px
        margin-bottom: 100px
        border-radius: 5px
    
    .verification-input
        margin: 10px !important
    .verification-btn
        padding: 6px

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