<template lang="pug">
    .verification-area
        h3 Please verify your email
        .verification-box
            p Enter the verification code sent to your email.
            Input( v-model="codeInput" @change="checkKey" @keyup.enter.native="confirmCode" ).verification-input 
            Button.confirm-btn(type="success" ghost icon="md-checkmark" @click="confirmCode" ) Confirm Code
        p.small-italic Did not receive it?
        Button.verification-btn(icon="md-send" @click="sendVerificationCode" ) Request another code
</template>


<script>
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import { AxiosPostRequest } from '@/mixins/axiosRequest'
import {vxm} from '@/store'
import config from '@/config'

@Component({mixins:[AxiosPostRequest]})
export default class ErrorMessage extends Vue{
    codeInput = ''

    checkKey(){
        console.log('yes')
    }

    confirmCode(){
        if(!this.codeInput) return this.$Message.error('Please enter a valid code')
        let email = vxm.user.activeUser.email
        let username = vxm.user.activeUser.username
        let code = this.codeInput
        let self = this
        try{
            this.axiosPostRequest(config.server.CHECK_CODE, {email}, {code})
                .then(res=>{
                    console.log(res)
                    this.$router.replace( `${config.client.USERS_URL}/${username}/todos`)    
                })
                .catch(err=>{
                    if(err.response.status == 401 )
                        self.$Message.error({  content: `Could not activate. Either your code has expired or you introduced the wrong code`, duration: 7 })
                    console.log(err.message)
                    console.dir(err)
                    console.log(err.status)
                })
                .catch(err=>console.log(err))
        }catch(e){
            console.error(e)
        }
    }
    sendVerificationCode(){
        let email = vxm.user.activeUser.email
        try{
            this.axiosPostRequest(config.server.ACTIVATE_USER, {email})
        }catch(e){
            console.error(e)
        }
    }
    mounted(){
        // this.sendVerificationCode()
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

.small-italic
    font-size: 11px
    font-style: italic

</style>