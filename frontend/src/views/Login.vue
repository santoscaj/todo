<template lang="pug">
  div
    h3 This is login page
    div.main
      Card.card
        Form
          FormItem(label="username")
            Input(prefix="ios-contact" placeholder="Enter name")
          FormItem(label="password")
            Input(type="password" password v-model="password")
        Button(type="error")  Submit
        div.register
          a forgot password
          p No account? 
            a Sign Up here
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'

@Component
export default class Login extends Vue{
  username = ''
  password = ''
}

</script>

<style lang="sass" scoped>
.main
  display: flex
  justify-content: center

.card
  width: 300px

.register
  margin: 8px
  padding: 5px
  font-size: 11px

</style>
