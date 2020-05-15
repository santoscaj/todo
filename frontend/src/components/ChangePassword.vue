<template lang="pug">
    transition(name="slide")
        div(v-if="display").change-password-area
            div
            Form.grid
                p Current Password
                Input(type="password" password)
                p New Password
                Input(type="password" password)
                p Confirm Password
                Input(type="password" password)
            .button-area
                Button(icon="md-checkmark-circle-outline" @click="savePassword"  size="small" pre) Save new password
                Button(icon="md-checkmark-circle-outline" @click="savePassword" type="success" size="small" pre) Save new password
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
.change-password-area
    background: rgb(0,0,0,0.1)
    border: 1px solid black
    border-radius: 5px
    padding: 15px

.grid
    width: 800px
    max-width: 100%
    margin: auto
    display: grid
    grid-template-columns: 50% 50%
    grid-row-gap: 5px

.slide-enter-active, .slide-leave-active
    transition: opacity  0.8s ease-in-out

.slide-enter, .slide-leave-to
    opacity: 0

.button-area
    display: flex
    justify-content: flex-end
    margin: 10px 0 0 0

</style>