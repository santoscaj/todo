<template lang="pug">
    Menu(mode="horizontal") Alberto Santos
        Submenu(mode="vertical" name="menu")
            template(slot="title")
                Avatar(size="large" src="https://www.pngitem.com/pimgs/m/487-4876417_link-head-png-toon-link-face-png-transparent.png")
            MenuItem(name="user_config") Config
            MenuItem(name="manage_users") Management 
            MenuItem(name="logout") Logout
</template>


<script>
import {Component, Vue, PropSync, Watch} from 'vue-property-decorator'

@Component
export default class Password extends Vue{

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