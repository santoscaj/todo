<template lang="pug">
  div
    div(v-if="!errorOccurred")
      //- Input.search(v-model="search" icon="md-search" placeholder="Filter to-dos")
      //- .cards-area
      //-   .grid-block(v-for="todo in filteredTodos" :key="todo.id") 
      //-     .title(slot="title") 
      //-       input.title-input(v-model="todo.title")
      //-       Button.close-btn(type="error" size="small" @click="removeTodo(todo.id)")
      //-         Icon(type="md-close")
      //-     Input(type="textarea" :rows="10" v-model="todo.content" style="width: 200px" ) 
      //-   .grid-block(v-for="draft in filteredDrafts" :key="draft.id") 
      //-     .title(slot="title") 
      //-       input.title-input(v-model="draft.title")
      //-       Button.close-btn(type="error" size="small" @click="removeDraft(draft.id)")
      //-         Icon(type="md-close")
      //-     Input(type="textarea" :rows="10" v-model="draft.content" style="width: 200px" ) 
      //-   .add-btn-area
      //-     Button.add-btn(@click="addDraft()")
      //-       Icon(type="md-add")
      //- .apply-discard-changes
      //-   Button(type="error" @click="discardChanges()") Discard Changes
      //-     Icon(type="ios-close-circle-outline")
      //-   Button(type="success" @click="applyChanges()") Apply Changes
      //-     Icon(type="md-checkmark")
      TodoList
    ErrorPage(v-else :status="status" :statusMessage="statusMessage")

</template>

<script>
import {Component, Vue, Watch} from 'vue-property-decorator'
import config from '@/config'
import {vxm} from '@/store'
import axios from 'axios'
import ErrorPage from '@/components/ErrorPage.vue'
import TodoList from '@/components/TodoList.vue'
import {AxiosGetRequestStatus, AxiosPutRequest, AxiosDeleteRequest} from '@/mixins/axiosRequest'
import {v4} from 'uuid'


@Component({components:{ErrorPage, TodoList},  mixins: [AxiosGetRequestStatus, AxiosPutRequest, AxiosDeleteRequest]} )
export default class Todos extends Vue {
  user = null
  search=''
  todos = []
  drafts = []
  itemsToBeRemovedFromDb = []

  get activeUser(){
    return vxm.user.activeUser
  }
  
  get pageOwner(){
    return this.$route.params.username
  }

  get searchKeywordsAsRegex(){
    return this.search.split(' ').map(key=>new RegExp(key.replace(/\W/,''),'i'))
  }

  get filteredTodos(){
    return this.todos.filter(item=> this.searchKeywordsAsRegex.some(keywordRegex=>{
      return keywordRegex.test(item.title) || keywordRegex.test(item.content)
    }))
  }
  get filteredDrafts(){
    return this.drafts.filter(item=> this.searchKeywordsAsRegex.some(keywordRegex=>{
      return keywordRegex.test(item.title) || keywordRegex.test(item.content)
    }))
  }
  
  get username(){
    return this.$route.params.username
  }

  async getUserInformation(){
    let username = this.$route.params.username
    let response = await this.axiosGetRequest(config.server.TODOS_URL,{username})
    this.todos = response.data
  }

  @Watch('pageOwner')
  updatePageInfo(){
    this.getUserInformation()
  }

  created(){
    this.getUserInformation()
  }

  removeListItem(list, id, alsoDeleteItemInDb=false){
    let index= list.indexOf(li=>li.id==id)
    let removedItem = list.splice(index, 1)
    if(alsoDeleteItemInDb)
      this.itemsToBeRemovedFromDb.push(removedItem)
  }

  removeTodo(id){
    this.removeListItem(this.todos, id, true)
  }

  removeDraft(id){
    this.removeListItem(this.drafts, id)
  }

  discardChanges(){
    this.getUserInformation()
    this.drafts = []
    this.itemsToBeRemovedFromDb = []
  }

  applyChanges(){
    if(this.todos.some(item=>!item.title))
      return this.$Message.error({content:'cannot save, there are todo items with no title', duration: 3})
    if(this.drafts.some(item=>!item.title))
      return this.$Message.error({content:'cannot save, there are drafts with no title', duration: 3})
    this.deleteItems()
    this.updateItems()
    this.createItems()
    // this.getUserInformation()
  }

  async deleteItems(){
    let username = this.pageOwner
    let response = await this.axiosDeleteRequest(config.server.TODOS_BULK_URL, {username}, this.itemsToBeRemovedFromDb)
  }
  
  async updateItems(){
    let username = this.pageOwner
    let response = await this.axiosPutRequest(config.server.TODOS_BULK_URL, {username}, this.todos)
    this.todos = response.data
  }
  async createItems(){
    
  }

  addDraft(){
    if (this.drafts.some(draft=>!draft.content || !draft.title))
      console.log('shouldnt be added, but it did')
    this.drafts.push({id: v4(),content: '', title:''})
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
  position: relative
  display: grid
  width: 100%
  height: 100%
  grid-auto-flow: row
  grid-template-rows: repeat(auto-fill, minmax(200px, 205px))
  grid-template-columns: repeat(auto-fill, minmax(205px, 210px))
  grid-gap: 20px

.grid-block
  padding: 3px
  background: rgb(0,0,0,0.1)

.title
  font-size: 13px
  text-transform: uppercase
  display: flex
  padding: 2px 

.title-input
  text-align: center
  width: 100%
  background: transparent
  border: none
  text-transform: uppercase
  font-weight: 600

.close-btn
  font-size: 10px
  width: 20px
  height: 20px
  padding: 0

.add-btn-area
  display: flex
  justify-content: center
  align-items: center
  min-width: 220px
  min-height: 200px

.add-btn
  background: transparent
  width: 60px
  height: 60px
  border: 1px dashed gray
  transition: all ease .3s
  &:hover
    background: transparent
    width: 65px
    height: 65px
    font-weight: 300
    font-size: 25px 
    color: gray
    border: 1.5px dashed gray

.search
  max-widtH: 800px
  padding: 0 0 20px 0

.apply-discard-changes
  padding: 20px
  &>*
    margin: 10px
</style>
