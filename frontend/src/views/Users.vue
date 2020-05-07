<template lang="pug">
  div
    h3 This is admin users page
    Table(:columns="columns" :data="tableData" border disabled- size="small")
      template(slot-scope="{ row, index }" slot="action")
        Tooltip(content="Reset user password" placement="top")
          Button.btn()
            Icon(type="md-refresh")
        Tooltip(content="Delete User" placement="top")
          Button.btn(type="error") 
            Icon(type="ios-trash-outline")

</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import { vxm } from '@/store'

@Component
export default class Login extends Vue{

  get columns(){
    return [
      {title:'id', key:'id', width: 60}, 
      {title:'username', key:'username'}, 
      {title:'email', key:'email'}, 
      {title:'admin priviledges', key:'admin'}, 
      {title:'action', slot:'action', width: 180, align:'center'}]
  }

  get tableData(){
    return vxm.user.users.map(obj=>{
      return {
        id: obj.id,
        username: obj.username, 
        email: obj.email, 
        admin: obj.is_admin === true? 'enabled': 'disabled'
      }
    })
    // return [{one: 'this is one ', rwo:'2'},{one: 'palomon', rwo:'ok'}]
  }

  created(){
  }
}



</script>

<style lang="sass" scoped>
.btn 
  margin-left: 3px
  margin-right: 3px

</style>
