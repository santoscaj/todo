<template lang="pug">
Header
    .spacer
    .header-title {{title}}
    .menu(@click.stop="showOrNot(!show)")
        div {{activeUser.username}}
        Avatar(size="small" :src="activeUser.image_link" v-if="login")
        Icon.menu-icon(type="ios-arrow-down" v-if="login")
        transition(name="my-transition")
            .sub-menu(v-if="show" @click.stop="showOrNot(!show)" ref="sub")
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

    showOrNot(show = false){
        this.show = show
        if(show)
            addEventListener('click',e=>{this.$refs.sub.style.display = 'none'},{once:true})
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

    mounted(){
        addEventListener('click', this.showOrNot)
    }
}
</script>

<style lang="sass">

.ivu-layout-header
    // font-family: 'Sarpanch', sans-serif
    color: black
    user-select: none

.menu
    position: relative
    height: 100%
    display: flex
    justify-items: flex-end
    align-items: center
    cursor: pointer
    padding: 5px
    width: 200px

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

</style>