<template lang="pug">
  div#app
    Header
    div routes only for testing purposes
      div.flex
        router-link(v-for="r of routes" :key="r" :to="r") {{r}}
    router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from './components/Header.vue';
import axios from 'axios'
// import {vmx} from './store'
import {vxm} from './store'
import {myRoutes} from './router'

let usersURI = 'http://localhost:3000/users'
let todosURI = 'http://localhost:3000/todos'

@Component({
  components: {
    Header,
  },
})
export default class App extends Vue {
  get routes(){
    return myRoutes.map(r=>r.path.replace(/:\w*/,'santoscaj'))
  }
  async mounted(){
    try{
      let resUsers = await axios.get(usersURI)
      vxm.user.setUsers(resUsers.data)
    }
    catch(e){
      vxm.user.setUsers([])
      console.error(e)
    }
  }

}
</script>

<style lang="sass">
#app 
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  box-sizing: border-box


.flex
  display: flex
  justify-content: space-between
  padding:10px
  border-bottom: 1px solid black

</style>
