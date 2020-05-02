<template lang="pug">
    transition(name="slide")
        div(v-if="display")
            div 
            Form.grid
                p Current Password
                Input(type="password" password)
                p New Password
                Input(type="password" password)
                p Confirm Password
                Input(type="password" password)
            div
                Button(@click="savePassword" type="success") Save changes
</template>


<script>
import {Component, Vue, PropSync, Watch} from 'vue-property-decorator'

@Component
export default class Password extends Vue{
    @PropSync('showPassword', { type: Boolean }) display
    
    resetFields(){}

    savePassword(){
        this.resetFields()
        this.display = false
    }
}
</script>

<style lang="sass">
.grid
    width: 800px
    margin: auto

    display: grid
    grid-template-columns: 50% 50%

.slide-enter-active, .slide-leave-active
    transition: opacity  .5s

.slide-enter, .slide-leave-to
    opacity: 0
    // transform: translate(0,-100px)

</style>