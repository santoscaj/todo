<template lang="pug">
Header
    .spacer
    .header-title {{title}}
    .menu(@click.stop="showOrNot()" v-if="login")
        .username {{activeUser.username}}
        Avatar(size="small" :src="activeUser.image_link" v-if="login && activeUser.image_link")
        Avatar(size="small" icon="ios-person" style="background:darkred" :src="activeUser.image_link" v-if="login && !activeUser.image_link") {{activeUser.username}}
        Icon.menu-icon(type="ios-arrow-down" v-if="login")
        transition(name="my-transition")
            .sub-menu(v-if="show" @click.stop ref="sub")
                //- .sub-menu-item(name="user_config" :to="`/users/activeUser.username}`") Config
                //- .sub-menu-item(v-if="activeUser.is_admin" name="manage_users" :to="`/management/users`") Management 
                router-link.sub-menu-item(name="logout" to="/logout")
                    Icon(type="md-log-out")
                    .logout Logout 
</template>


<script>
import {Component, Vue, PropSync, Watch} from 'vue-property-decorator'
import {vxm} from '@/store'

@Component
export default class MyHeader extends Vue{
    show=false

    showOrNot(){
        this.show = !this.show
        if(this.show)
            addEventListener('click',()=>{this.show=false},{once:true})
    }

    get title(){
        return this.$route.meta.pageTitle
    }

    get login(){
        return Boolean(vxm.user.usertoken)
    }

    get activeUser(){
        let emptyUser = {
            username : '',
            image_link : '',
        }
        return vxm.user.activeUser || emptyUser
    }

    logout(item){

    }
}
</script>

<style lang="sass">


.ivu-layout-header
    // font-family: 'Sarpanch', sans-serif
    color: #007ea7 !important
    font-weight: 600 !important
    user-select: none

.menu
    position: relative
    height: 100%
    display: flex
    justify-content: flex-end
    align-items: center
    cursor: pointer
    padding: 5px
    width: 200px

    .username
        padding-right: 8px 
        font-size: 12px

    .menu-icon:hover
        color: white
        animation: slide 2s ease-in-out .5s infinite alternate

    .sub-menu
        position: absolute
        top: 100%
        right: 0
        heigth: auto
        z-index: 1
        background: white
        border-radius: 0 0 0 5px
        box-shadow: 0 5px 10px -5px
        cursor: pointer
        user-select: none

        .sub-menu-item
            font-size: 12px
            padding: 5px 10px
            display: flex
            align-items: center
            justify-content: space-between
            min-width: 80px            

.spacer
    width: 380px

.username
    font-size: 18px

.my-transition-enter-active, .my-transition-leave-active 
  transition: opacity .3s

.my-transition-enter, .my-transition-leave-to
  opacity: 0.2

.header-title
    flex: 1 1 auto
    font-family: 'Sarpanch', sans-serif
    font-family: 'Open Sans', sans-serif

</style>