<template lang="pug">
  div
    h1 This is Usr settings page  
    div.settings
      div.mini-header
        Button(v-show="!edit" @click="edit = true" type="warning")
          Icon(type="md-create" )
        Button(v-show="edit" @click="edit = false" type="error")
          Icon(type="md-close")
        Button(v-show="edit" @click="edit = false" type="success")
          Icon(type="md-checkmark")
      p.label username
      Input(:disabled="!edit")
      p.label email
      Input(:disabled="!edit")
      p.label First Name
      Input(:disabled="!edit")
      p.label Last Name
      Input(:disabled="!edit")
      p.label Admin priviledges
      Input(:disabled="true")
      p.label Profile Picture
      Input(:disabled="!edit")
    a(@click="changePassword") change password
    ChangePassword.password-area(:showPassword="display" @update:showPassword="updatedPassword($event)")
      
      
</template>

<script>
import {Vue, Component} from 'vue-property-decorator'
import ChangePassword from '@/components/ChangePassword.vue'

@Component({
  components: {ChangePassword}
})
export default class Profile extends Vue {
  edit = false
  display = false

  changePassword(){
    this.display = true
  }

  updatedPassword(x){
    this.display = false
  }
}
</script>

<style lang="sass">
.settings
  width: 800px
  margin: auto
  left: 50%

  display: grid
  grid-template-columns: 50% 50%
  grid-row-gap: 5px

.mini-header
  grid-column: 1 / span 2
  display: flex
  justify-content: flex-end

.password-area
  z-index: -1

</style>
