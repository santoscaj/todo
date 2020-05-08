<template lang="pug">
  div
    div(v-if="!errorOccurred")
      div.cards-area
        Card.card(v-for="todo in todos" :key="todo.id") 
          p(slot="title") {{todo.title}}
          p(v-for="item in todo.content" :key="item") {{item}}
      div.my-flex
    ErrorPage(v-else :status="status" :statusMessage="statusMessage")

</template>

<script>
import {Component, Vue, Watch} from 'vue-property-decorator'
import Config from '@/config'
import {vxm} from '@/store'
import axios from 'axios'
import ErrorPage from '@/components/ErrorPage.vue'
import AxiosRequest from '@/mixins/axiosRequest'

@Component({components:{ErrorPage},  mixins: [AxiosRequest]} )
export default class Todos extends Vue {
  user = null
  statusMessage = 'default'
  status = 'default'
  errorOccurred = false

  get activeUser(){
    return vxm.user.activeUser
  }
  
  get pageOwner(){
    return this.$route.params.username
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

  @Watch('pageOwner')
  updatePageInfo(){
    this.getUser()
  }

  created(){
    this.getUser()
  }

  async getUser(){
    let pageOwner = this.$route.params.username
    let response = await this.axiosGetRequest(`${Config.server.USERS_URL}/${pageOwner}/todos`)
    this.user = ( response  && response.data) ? response.data : null
  }

  modifyDropdownValue(newValue){
    this.dropdown = newValue
  }
}
</script>


<style lang="sass" scoped>

.my-flex
  display: flex
  flex-direction: column

.cards-area
  position: absolute
  heigth: 100%
  display: grid
  grid-template-rows: repeat(auto-fill, minmax(115px, 200px))
  grid-template-columns: repeat(auto-fill, minmax(100px, 350px))
  grid-gap: 20px

.card
  width:100%
  height:100%

</style>
