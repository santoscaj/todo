<template lang="pug">
  div 
    BlockPage(v-if="pageLockedToThisSession" message="This page is being edited in a different session.\nPlease wait until editing is complete")
    h3  {{title}}
    div(v-if="!errorOccurred")
      .search-area
        .group-button-area View Mode 
          Button(size="small" @click="cardsStyle=true")
            Icon(type="md-apps")
          Button(size="small" @click="cardsStyle=false")
            Icon(type="md-list")
          Button(size="small" @click="cardsHover=true")
            Icon(type="md-arrow-up")
          Button(size="small" @click="cardsHover=false")
            Icon(type="md-arrow-down")
        .spacer
        Input.search(v-model="search" icon="md-search" placeholder="Filter to-dos")
      .cards-area(:class="{'grid-area':cardsStyle, 'horizontal-line':!cardsStyle}")
        TodoList(v-for="todo in filteredTodos" 
        :todo="todo" 
        @update="updateList(todo.id)" 
        @change="listChanged({event: $event, id:todo.id})"
        @locklist="requestListLock(todo.id)"
        @releaselist="requestListRelease(todo.id)"
        :cardsStyle="cardsStyle"
        :hover="cardsHover"
        editingUser=""
        )
        ShareSettings( title="Share list settings" :value.sync="displayShared" :listId="sharedListId")
        .add-btn-area
          Button.add-btn(v-on:click="addTodoList()")
            Icon(type="md-add")
    ErrorPage(v-else :status="status" :statusMessage="statusMessage")

</template>

<script>
import {Component, Vue, Watch} from 'vue-property-decorator'
import config from '@/config'
import {vxm} from '@/store'
import axios from 'axios'
import ErrorPage from '@/components/ErrorPage.vue'
import TodoList from '@/components/TodoList.vue'
import BlockPage from '@/components/BlockPage.vue'
import ShareSettings from '@/components/ShareSettings.vue'
import {AxiosGetRequestStatus, AxiosPutRequest, AxiosDeleteRequest} from '@/mixins/axiosRequest'
import {v4} from 'uuid'
import {emptyTodoList} from '@/utils/emptyTodo'
import {socket} from '@/socket'

@Component({components:{ErrorPage, TodoList, ShareSettings, BlockPage},  mixins: [AxiosGetRequestStatus, AxiosPutRequest, AxiosDeleteRequest]} )
export default class Todos extends Vue {
  user = null
  search=''
  allTodos = []
  drafts = []
  itemsToBeRemovedFromDb = []
  listsWithErrors = []
  displayShared=false
  sharedListId=0
  cardsStyle=true
  cardsHover=true
  
  get allTodosPlus(){
    let listsBeingEdited = socket.listsBeingEdited
    return this.allTodos.map(todo=>({...todo, userEditingList:listsBeingEdited[todo.id]||''}) )
  }

  get pageLockedToThisSession(){
    return socket[this.pageName]
  }

  get activeUser(){
    return vxm.user.activeUser
  }
  
  get todoType(){
    return this.$route.meta.list
  }

  get title(){
    let options={
      'all' : 'All To-dos',
      'shared' : 'Shared with me',
      'favorites' : 'My favorites',
      'owned' : 'My To-dos',
    }
    return options[this.todoType]
  }

  get pageOwner(){
    return this.$route.params.username
  }

  get searchKeywordsAsRegex(){
    return this.search.split(' ').map(key=>new RegExp(key.replace(/\W/,''),'i'))
  }

  get filteredTodos(){
    return this.allTodosPlus
    .filter(list=>this.todoType=='all' || this.todoType==list.listType)
    .filter(list=> this.searchKeywordsAsRegex.every(keywordRegex=> keywordRegex.test(list.name) || list.todoitems.some(item=>keywordRegex.test(item.content))))
  }
  
  get username(){
    return this.$route.params.username
  }

  async getUserInformation(){
    let username = this.$route.params.username
    let response = await this.axiosGetRequest(config.server.TODOLISTS_URL,{username})
    this.allTodos = []
    let todolists = response.data
    if(todolists){
      for(let listType in todolists)
        this.allTodos.push(...todolists[listType].map(item=>({...item, listType})))
    }
    
    // this.todos = response.data
  }
  
  get pageName(){
    let routeName = this.$route.name
    let nameDividedByChild = routeName.split('-')
    let pageName = nameDividedByChild[0]
    return pageName
  }

  mounted(){
    if(!vxm.user.userIsLoggedIn)
      throw 'cannot lock page, no active user'
    let username = this.activeUser.username
    socket.lockPage(this.pageName, username)
  }

  requestListLock(listId){
    if(!vxm.user.userIsLoggedIn)
      throw 'cannot lock list, no active user'
    let username = this.activeUser.username
    socket.lockList(listId, username) 
  }

  requestListRelease(){
    let username = this.activeUser.username
    socket.lockList(listId, username) 
  }

  addTodoList(){
    if(this.allTodos.some(list=>!list.name || list.todoitems.some(item=>!item.content)))
      return this.$Message.error('One or more lists have incomplete fields. Complete other lists to continue')

    let newList = emptyTodoList()
    newList.id = v4()
    this.allTodos.push(newList)
  }

  @Watch('pageOwner')
  updatePageInfo(){
    this.getUserInformation()
  }

  created(){
    this.getUserInformation()
  }



  // handles errors
  foundListErrors(list){
    let errorMessage = null
    let self = this

    if(!list)
      errorMessage = `ERROR NO LIST FOUND`
    else if(list && !list.name)
      errorMessage = `couldnt save list ${list.name.toUpperCase()}. Title is empty.`
    else if(list && list.todoitems.some(item=>!item.content))
      errorMessage = `couldnt save list ${list.name.toUpperCase()}. One or more todo items are empty.`

    if(errorMessage){
      if(this.listsWithErrors.findIndex(obj=>obj.listId==list.id)==-1){
        let error = this.$Message.error({
          content: errorMessage,
          duration: 0,
          closable: true,
          onClose: ()=>{
            let index = self.listsWithErrors.findIndex(obj=>obj.listId==list.id)
            if(index>-1)
              self.listsWithErrors.splice(index, 1)
          }
        })
        this.listsWithErrors.push({listId: list.id, error})
      }
    }else{
      let index = self.listsWithErrors.findIndex(obj=>obj.listId==list.id)
      if(index>-1){
        let obj = self.listsWithErrors.splice(index, 1)[0]
        obj.error()
      }
    }

    return Boolean(errorMessage)
  }

  async updateList(listId){
    let self = this
    let listToUpdate = this.allTodos.find(list=>list.id==listId)
    let email = vxm.user.activeUser.email
    
    if(this.foundListErrors(listToUpdate))
      return

    try{
      let response = await this.axiosPutRequest(config.server.TODOLIST_URL,{email, todolist_id: listId}, listToUpdate)
    }catch(e){
      console.error(e)
      let errorMessage = `error saving list ${listToUpdate.id} ${listToUpdate.name}. ${e.message}`
      let error = this.$Message.error({
        content: errorMessage,
        duration: 0,
        closable: true,
        onClose: ()=>{
          let index = self.listsWithErrors.findIndex(obj=>obj.listId==listToUpdate.id)
          if(index>-1)
            self.listsWithErrors.splice(index, 1)
        }
      })
      this.listsWithErrors.push({listId: listId, error})
    }
  }

  async shareList(id){
    this.sharedListId = id
    this.displayShared = true
  }

  async duplicateList(id){
    let listToDuplicate = this.allTodos.find(list=>list.id==id)
    let email = vxm.user.activeUser.email
    let newList = {...listToDuplicate, id:'new', name: listToDuplicate.name+' (copy)'}
    
    if(this.foundListErrors(listToDuplicate))
      return

    try{
      
      let response = await this.axiosPutRequest(config.server.TODOLIST_URL,{email, todolist_id: newList.id}, newList)
      this.allTodos.push({...response.data.owned, listType: 'owned'})
      console.log('reached here')

  }catch(e){
      console.error(e)
    }
  }

  deleteList(id){
    return async () => {
      let email = vxm.user.activeUser.email
      try{
        let response = await this.axiosDeleteRequest(config.server.TODOLIST_URL,{email, todolist_id: id})
        let index= this.allTodos.findIndex(list=>list.id==id)
        this.allTodos.splice(index, 1)
        this.$Message.success('list deleted successfully')
      }catch(e){
        console.error(e)
      }
    }    
  }

  confirmDeletion(id){
    this.$Modal.confirm({
      title: 'Delete account',
      content: 'Are you sure you would like to delete the list',
      onOk: this.deleteList(id),
      okText: 'OK',
      cancelText: 'Cancel'
    })
  }

  listChanged(event){
    if(event.event=='share')
      this.shareList(event.id)
    else if(event.event=='delete')
      this.confirmDeletion(event.id)
    else if(event.event=='duplicate')
      this.duplicateList(event.id)
  }

  removeListItem(list, id, alsoDeleteItemInDb=false){
    let index= list.indexOf(li=>li.id==id)
    let removedItem = list.splice(index, 1)
    if(alsoDeleteItemInDb)
      this.itemsToBeRemovedFromDb.push(removedItem)
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

.horizontal-line
  // display: grid
  // grid-template-columns: 1fr
  // grid-template-rows: auto
  // grid-gap: 20px
  display: flex
  flex-direction: column

.grid-area
  position: relative
  display: grid
  width: 100%
  height: 100%
  grid-auto-flow: row
  grid-template-rows: repeat(auto-fill, minmax(var(--card-height), calc(var(--card-height) + 10px)))
  grid-template-columns: repeat(auto-fill, minmax(var(--card-width), calc(var(--card-width) + 10px)))
  grid-gap: 20px

// .grid-block
//   padding: 3px
//   background: rgb(0,0,0,0.1)

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

.search-area
  display: flex
  align-items: center
  justify-content: center
  margin: 0 0 20px 0

.group-button-area
  flex: 0 0 auto

.spacer
  flex: 1 2 auto

.search
  max-widtH: 500px
  // padding: 0 0 20px 0

.apply-discard-changes
  padding: 20px
  &>*
    margin: 10px
</style>
