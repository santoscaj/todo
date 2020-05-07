<template lang="pug">
    Menu(mode="horizontal") {{activeUser.username}}
        Submenu(mode="vertical" name="menu")
            template(slot="title")
                Avatar(size="large" :src="activeUser.image_link")
            MenuItem(name="user_config") Config
            MenuItem(name="manage_users") Management 
            MenuItem(name="logout") Logout
</template>


<script>
import {Component, Vue, PropSync, Watch} from 'vue-property-decorator'
import {vxm} from '@/store'

@Component
export default class Password extends Vue{
    get activeUser(){
        let emptyUser = {
            username : '',
            image_link : '',
        }
        return vxm.user.activeUser || emptyUser
    }
}
</script>

<style lang="sass">
.header
    display: flex
    justify-content: flex-end
    align-items: center
    height: 50px
    width: 100%
    border: 1px solid red

.header>*
    margin: 4px

.username
    font-size: 18px


</style>