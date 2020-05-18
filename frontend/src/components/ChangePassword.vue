<template lang="pug">

.container
  .change-password-area(ref="psswd")
    Form.grid
      .label
        div Current Password
      Input(type="password" password v-model="currentPass")
      .label
        div New Password
      Input(type="password" password v-model="newPass")
      .label
        div Confirm Password
      Input(type="password" password v-model="confirmNewPass")
    .button-area
      Button(icon="md-close" @click="discardChanges"  size="small" pre) Discard Changes
      Button(icon="md-checkmark" @click="savePassword" size="small" pre) Save password

</template>


<script>
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import config from '@/config'
import { AxiosPostRequest } from '@/mixins/axiosRequest'
import { vxm } from '@/store'

@Component({ mixins: [AxiosPostRequest] })
export default class Password extends Vue{
    currentPass = ''
    newPass = ''
    confirmNewPass = ''

    @Prop({ type: Boolean }) display

    @Watch('display')
    async onDisplayChange(value){
      if(value){
        this.$el.style.setProperty('--container-height', this.$refs.psswd.clientHeight + 20 + 'px')
        // this.$refs.container.style.height = this.$refs["change-password"].clientHeight + 20 + 'px'
        setTimeout(()=>{
          this.$el.style.setProperty('--change-password-opacity', 1)
          // this.$refs["psswd"].style.opacity = 1
        },300)
      } else {
        this.$el.style.setProperty('--change-password-opacity', 0)
        // this.$refs["psswd"].style.opacity = 0
        setTimeout(()=>{
          this.$el.style.setProperty('--container-height', 0)
          // this.$refs.container.style.height = 0
        },300)
      }
    }
    
    get username(){
        return this.$route.params.username
    }

    resetFields(){  
        this.currentPass = '' 
        this.newPass = '' 
        this.confirmNewPass = '' 
    }
    savePassword(){
        if(!this.currentPass || !this.newPass || !this.confirmNewPass)
            return this.$Message.error('Please complete all password fields')
        
        if(this.newPass != this.confirmNewPass)
            return this.$Message.error('Passwords do not match')

        try{
            let body ={
                oldPassword: this.currentPass,
                newPassword: this.newPass,
            }
            this.axiosPostRequest(config.server.CHANGE_PASSWORD, {username: this.username}, body)
        }catch(e){
            console.error(e)
        }

        this.resetFields()
        this.display = false
    }

    discardChanges(){
        this.resetFields
        this.display = false
    }
}
</script>

<style lang="sass">
:root
  --container-height: 0
  --change-password-opacity: 0

.container
  height: var(--container-height)
  transition: height .3s ease-in-out
  overflow: hidden


.change-password-area
    background: #007ea7 
    background: rgb(0, 126, 167, 1)
    border: 1px solid black
    border: none
    border-radius: 5px
    margin: 10px !important
    padding: 15px
    color: white
    align-items: center
    justify-items: center

    opacity: var(--change-password-opacity)
    transition: opacity .5s ease-in-out
        
    .ivu-btn
        margin-right: 10px
        flex: 0 0 170px
    .label 
        padding: 0 10px
        display: flex
        align-items: center 
        justify-content: flex-end


.grid
    width: 800px
    max-width: 100%
    margin: auto
    display: grid
    grid-template-columns: 50% 50%
    grid-row-gap: 5px

.button-area
    display: flex
    justify-content: center
    margin: 10px 0 0 0

</style>