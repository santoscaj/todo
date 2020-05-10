<template lang="pug">
    .welcome-area 
        .welcome-message 
            p Thank you for creating an account! We are happy to see you here. 
            p You can finish setting up your account here, or you can skip and start adding items to your to-do list
        .go-to(@click="goToTodos()")
            Icon(size="20" type="md-fastforward") 
            span.button-big Skip
            p.button-small and go to To-do
</template>


<script>
import {Component, Vue, PropSync, Watch} from 'vue-property-decorator'

@Component
export default class Password extends Vue{

    goToTodos(){
        let username = this.$route.params.username
        this.$router.push({name:'Todos', params:{username}})
    }
}
</script>

<style lang="sass">

.welcome-area
    display: flex
    border: 1px solid gray
    border-radius: 5px
    margin: 10px 0
    padding: 10px

.welcome-message
    flex: 1 1 200px
    display: flex
    flex-direction: column
    justify-content: center
    font-size: 13px

.go-to
    border: 1.5px solid red
    border-radius: 5px
    padding: 5px
    margin: 5px
    padding: 4px
    transition: font-size ease .7s
    cursor: pointer
    
    .button-big
        font-weight: 900
    
    .button-small
        font-size: 10px

    &:hover
        color: black
        background: salmon
        // font-size: 15px
        

</style>

<Icon type="md-return-right" />