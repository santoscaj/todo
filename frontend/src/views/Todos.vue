<template lang="pug">
  div
    h1 This is Todos page 
    div(v-if="userHasAccess")
      div.cards-area
        Card.card(v-for="todo in todos" :key="todo.id") 
          p(slot="title") {{todo.title}}
          p(v-for="item in todo.content" :key="item") {{item}}
      div.my-flex
    ErrorPage(v-else :status="status" :statusMessage="statusMessage")

</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import config from '@/config'
import {vxm} from '@/store'
import axios from 'axios'
import ErrorPage from '@/components/ErrorPage.vue'

@Component({components:{ErrorPage}})
export default class Todos extends Vue {
  user = null
  statusMessage = ''
  status = ''

  get serverURL(){
    return config.server.BASE_URL
  }
  get activeUser(){
    return localStorage.getItem('username')  
  }
  get activeToken(){
    return localStorage.getItem('token')  
  }
  get pageOwner(){
    return this.$router
  }
  get userHasAccess(){
    return (this.status == 200 || this.status==201)
  }
  get todos(){
    if (!this.user)
      return []
    return this.user.todos
		.map(x=>{
      if(x)
        return {...x, content: x.content.split('\n')}
    })
  }

  async beforeUpdate(){
    console.log('before Update')
  }

  async beforeCreate(){
    let self = this
    
    axios.interceptors.response.use(
      response=>{
        this.status = response.status
        this.user = response.data
        console.log('data',response)
      },
      err=>{
        this.status = err.response.status
        this.statusMessage = err.response.statusText
      })

    let accessToken = localStorage.getItem('token') 
    let pageOwner = this.$route.params.username

    try{
      await axios.post(`${config.server.USERS_URL}/${pageOwner}/todos`,{
          pageOwner,
          accessToken
      })
    }catch(x){}

  }

  modifyDropdownValue(newValue){
    this.dropdown = newValue
  }
}
</script>


<style lang="sass" scoped>

.header
  display:flex
  margin: 20px

.header>*
  width: auto
  
.my-flex
  display: flex
  flex-direction: column

.cards-area
  position: absolute
  width: 100%
  heigth: 100%
  display: grid
  grid-template-rows: repeat(auto-fill, minmax(115px, 200px))
  grid-template-columns: repeat(auto-fill, minmax(100px, 350px))
  grid-gap: 20px

.card
  width:100%
  height:100%

</style>
