<template lang="pug">
    .verification-area
        h3 Please verify your account 
        .verification-box
            p Enter the verification code sent to your email.
            Input.verification-input 
            Button.verification-btn(icon="md-send") Send another code
</template>


<script>
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'

@Component
export default class ErrorMessage extends Vue{

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

</style>