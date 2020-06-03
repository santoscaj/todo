<template lang="pug">
    transition(name="fade")
        .my-modal(v-if="value")
            .confirmation-box
                .header-area
                    p {{title}}
                    Icon(type="md-close" @click="confirmation(true)" )
                .share-area
                    p Users that currently have access to list:
                    .shared-users-area
                        .share-item(v-for="list in sharedUsers" :key="list.user.id")
                            p {{list.user.email}}
                            button.close-btn(@click="removeShared(list.user.email)") 
                                Icon(type="md-close")
                    .add-newuser-area
                        p add new user :
                        .add-user-box
                            Input(placeholder="email@address.com" icon="ios-mail-outline" v-model="emailToShareWith")
                            button.add-btn(@click="shareWithUser()") share 
                                Icon(type="md-person-add")
                .confirmation-area
                    button.confirmation-btn.blue(  @click="confirmation(true)") Done
</template>

<script>
import {Component, Vue, Watch, Prop} from 'vue-property-decorator'
import {AxiosGetRequest, AxiosPostRequest, AxiosDeleteRequest} from '@/mixins/axiosRequest'
import config from '@/config'
// import {vxm} from '@/store'
// import axios from 'axios'

@Component({mixins: [AxiosGetRequest, AxiosPostRequest, AxiosDeleteRequest]})
export default class ShareSettings extends Vue{
    emailToShareWith = ''
    
    @Watch('value')
    async valueChanged(newValue){
        if(!newValue)
            return 
        try{
            let response = await this.axiosGetRequest(config.server.SHARED_LISTS_URL, {todolist_id: this.listId})
        }catch(e){
            console.error(e)
            this.$Message.error('cannot share list at the moment')
            this.confirmation()
        }
    }

    async shareWithUser(){
        let email = this.emailToShareWith
        let todolist_id = this.listId

        try{
            let response = await this.axiosPostRequest(config.server.SHARED_LISTS_URL, {todolist_id}, {email})
            this.sharedUsers.push(response.data.todolistuser)
            this.emailToShareWith = ''
        }catch(e){
            if(e.response.status && e.response.status==409)
                this.$Message.error("Couldn't share. User already has access to this list")
            console.dir(e)
        }

    }

    async removeShared(email){

        console.log('removing ', email)
        let index = this.sharedUsers.findIndex(list=>list.user.email == email)
        if(index==-1) return this.$Message.error('Specific user not found')
        let todolist_id = this.sharedUsers[index].todolist_id
        try{
            let response = await this.axiosDeleteRequest(config.server.TODOLIST_URL,{email, todolist_id})
            this.sharedUsers.splice(index, 1)
        }catch(e){
            console.error(e)
        }
    }

    @Prop( {type: String, default: 'Share Settings'}) title
    @Prop( {type: Boolean, default: true, required: true}) value
    @Prop( {type: Function, default: ()=>{} }) callback
    @Prop( {type: Number, required:true}) listId

    sharedUsers = []

    confirmation(confirmation){
        this.$emit('update:value', false)
        this.callback(confirmation)
        this.sharedUsers = []
    }

}

</script>

<style lang="sass" scoped>
.fade
    overflow: hidden

.my-modal
    background: rgb(0,0,0,0.4)
    position: fixed
    z-index: 1
    left: 0
    right: 0
    top: 0
    bottom: 0
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    align-items:center
    overflow: hidden
    z-index: 10

.confirmation-box
    background: white
    width: 460px
    height: auto
    margin-bottom: 10em
    border-radius: 5px
    display: flex
    flex-direction: column
    overflow: hidden

.header-area
    display: flex
    background: lightgray
    margin: 0
    border-radius:5px 5px 0 0
    height: auto
    padding: 3px
    font-size: 12px
    &>p
        flex: 1 1 100%
    &>i
        padding: 4px
    

.share-area
    margin: 20px 10px

.shared-users-area
    border: 1px solid gray
    height: 150px
    margin: 0 15px
    overflow: auto
    display: flex
    flex-wrap: wrap
    justify-content: flex-start
    align-items: flex-start
    align-content: flex-start

.share-item
    margin: 2px
    display: flex
    padding: 2px
    border-radius: 3px
    align-items:center
    justify-content: flex-start
    border: 1px solid lightgray

.add-newuser-area
    margin: 20px

.add-user-box
    display: flex

.add-btn
    background: white
    outline: none
    border: 1px solid lightgray
    border-radius: 3px
    width: 100px
    margin: 0 3px
    &:hover
        border-color: black
        color: darkblue

.confirmation-area
    display: flex
    align-items: flex-end
    justify-content: flex-end
    flex: 1 1 40px

.confirmation-btn
    color: black
    font-size:12px
    background: white
    border: 1px solid black
    margin: 5px
    padding: 2px 4px
    border-radius: 2px
    height: 25px
    width: 50px

.close-btn
    margin: 1px
    background: white
    border: 1px solid lightgray
    border-radius: 3px
    width: 15px
    height: 15px
    line-height: 15px
    &:hover
        border: 1px solid red
        color: red
    &:focus
        outline: 0


.confirmation-btn:hover
    cursor: pointer


.blue:hover
    border: 1px solid blue
    background: cornflowerblue
    color: white

.blue:hover
    border: 1px solid blue
    background: white
    color: black

.red:hover
    background: salmon
    border: 1px solid red
    color: white

.fade-enter-active 
  transition: all .3s ease

.fade-leave-active 
  transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0)


.fade-enter, .fade-leave-to
  opacity: 0


</style>