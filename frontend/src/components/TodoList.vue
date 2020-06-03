
<template lang="pug">

.mycontainer(ref="container" :class="{hover: hover, card:cardsStyle, tile:!cardsStyle}" @click="titleClicked()")
  .title
    input.title-input(v-model="todo.name" :disabled="!edit" @input="update()")
    button.mini-btn#options(size="small" @click.stop="showMiniMenu()" :class="{'light-background': miniMenu}")
      Icon(type="md-more")
    .options(v-if="miniMenu")
      .option-item(v-for="option in options" :key="option.name" @click="option.call") {{option.name}}
  .todo-list(:style="{'pointer-events': edit? 'auto': 'none'}" :class="{'todo-list-selected': displayBody}")
    .todo-item(v-for="item in todo.todoitems" :key="item.id")
      checkbox(v-model="item.completed" @input="update()")
      input(:class="{completed:item.completed}" v-model="item.content" :ref="'input'+item.id" @input="update()")
      button.mini-btn.close-btn(@click="removeItem(item.id)")
        Icon(type="md-close")
    .todo-item
      .space
      button.mini-btn.add-btn(@click="addItem()")
        Icon(type="md-add")
    //- Input(type="textarea" :rows="10" v-model="draft.content" style="width: 200px" )
  .usage-info(:style="{visibility: editingUser? 'visible': 'hidden'}")
    p {{editingUser}} modifying this container 
      span.typing#dot1 .
      span.typing#dot2 .
      span.typing#dot3 .

</template>

<script lang="ts">
//@ts-nocheck
import { v4 } from 'uuid'
import { Component, Prop, Vue , Watch} from 'vue-property-decorator';
import {TodoList} from '@/store'
import {emptyTodoItem} from '@/utils/emptyTodo'


@Component
export default class TodoLists extends Vue {
  emptyTodoItem = emptyTodoItem()

  @Prop( {type: String, default: ''}) editingUser
  @Prop( {type: Boolean, default: true}) debounce
  @Prop( {type: Number, default: 2000}) debounceTimer
  @Prop( {type: Boolean, default: false}) hover
  @Prop( {type: Boolean, default: true}) edit
  @Prop( {type: Boolean, default: true}) cardsStyle
  @Prop( {type: TodoList, default: emptyTodoItem}) todo

  makeBtnBigger=false
  miniMenu=false
  selected=false

  get disabledMessage(){
    return this.isBeingEdited? 'Todolist is being edited and cannot be modified' : 'Todolist cant be modified at the moment'
  }

  get displayBody(){
    return this.cardsStyle || this.selected
  }

  get isBeingEdited(){
    return !!this.editingUser
  }

  // changeEdit(){
  //   this.edit= !this.edit
  // }

  debouncer(){    
    let timeout = 0
    return function(){
      let timer = this.debounce ? this.debounceTimer : 0
      clearTimeout(timeout)
      timeout = setTimeout(()=>{this.$emit('update')}, timer)
    }
  }

  update = this.debouncer()

  addItem(){
    this.update()
    let todoItems = this.todo.todoitems
    let thereAreEmptyItems = todoItems.some(item=>!item.content)
    if(thereAreEmptyItems)
      this.$Message.error('complete current item to add more')
    else{
      let id = v4()
      todoItems.push({...emptyTodoItem, id})
      this.$nextTick(()=>{
        this.$refs['input'+id][0].focus()
        this.$refs['input'+id][0].select()
      })
    }
  }

  removeItem(itemId){
    this.update()
    let index = this.todo.todoitems.findIndex(item=>item.id==itemId)
    if(index>-1)
      this.todo.todoitems.splice(index, 1)
  }

  showMiniMenu(){
    let currentState = this.miniMenu
    this.miniMenu = !currentState
    if(!currentState)
      window.addEventListener('click', ()=>{this.miniMenu = false}, {once:true})
      this.$refs.container.addEventListener('click', ()=>{this.miniMenu = false}, {once:true})
  }

  titleClicked(){
    if(!this.edit)
      this.$Message.error(this.disabledMessage)
  }

  changeEvent(changeType){
    let self = this
    return function(eventType){
      self.$emit('change', changeType)
    }
  }

  removeCompleted(){
    let self = this
    return function(){
      self.update()
      let index = 0
      let todoitems = self.todo.todoitems
      while(index < todoitems.length){
        if(todoitems[index].completed)
          todoitems.splice(index, 1)
        else
          index++
      }
    }
  }

  options = [
    {
      name: 'share settings',
      call: this.changeEvent('share')
    },
    {
      name: 'remove completed',
      call: this.removeCompleted()
    },
    {
      name: 'copy/duplicate list',
      call: this.changeEvent('duplicate')
    },
    {
      name: 'delete list',
      call: this.changeEvent('delete')
    },
  ]

  // todo = {
  //   id: 1, 
  //   title: 'car brands',
  //   todoitems: [
  //     {         id:1,         completed: false,         content: 'tesla'       },       {         id:2,         completed: true,         content: 'honda'       },       {         id:3,         completed: false,         content: 'toyota'       },       {         id:4,         completed: false,         content: 'mazda'       },       {         id:5,         completed: false,         content: 'mercedes'       },       {         id:6,         completed: true,         content: 'skoda'       },             {         id:7,         completed: false,         content: 'mazda'       },       {         id:15,         completed: false,         content: 'mercedes'       },       {         id:61,         completed: true,         content: 'skoda'       },             {         id:14,         completed: false,         content: 'mazda'       },
  //   ]
  // }

}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">

input
  border: none
  &:focus
    border: none
    outline: none

.space
  flex: 1 1 100%

.mycontainer
  background: rgb(13,6,48,0.7)
  background: rgb(6,188,193,.7)
  background: rgb(230,57,70,1)
  background: rgb(0,0,0,0.1)
  color: black
  border: 1px solid black

.hover
  border: 1px solid black
  box-shadow:  0px 12px 15px 1px 
  box-shadow:  0px 12px 15px 1px hsla(0, 0%, 0%, 0.2)
  transition: all .3s ease
  &:hover
    transform: translate(0, 2px)
    box-shadow:  0px 10px 7px -2px black
    box-shadow:  0px 8px 4px -2px black
    box-shadow:  0px 9px 6px -2px black
    box-shadow:  0px 9px 8px -2px black hsla(0, 0%, 0%, 0.2)

.card
  padding: 0 3px 3px 3px 
  width: var(--card-width)

.tile
  width: 100%
  overflow: visible

.title
  position: relative
  font-size: 13px
  text-transform: uppercase
  display: flex
  padding-bottom: 1px 

.title-input
  user-select: none
  text-align: center
  width: 100%
  background: transparent
  border: none
  text-transform: uppercase
  font-weight: 600
  color: white
  color: black
  color: darkslateblue

.title-btns-area
  width: 24px
  height:22px
  line-height:22px
  flex: 0 0 24px

.mini-btn
  margin: auto
  font-size: 10px
  width: 20px
  height: 18px
  padding: 0
  text-align: center
  flex: 0 0 auto
  border: 1px solid lightgray
  transition: all .2s ease-in-out

.close-btn
  border-color: tomato
  background: white
  // color: red

.add-btn
  border-color: green
  background: white

.bigger-btn
  width: 24px
  height: 20px
  background: darkorange
  border: 1px solid orangered

.light-background
  background: rgb(255,255,255,0.8) !important

#options
  align-self: stretch
  background: transparent
  border: none
  width: 14px
  flex: 0 0 auto
  font-weight: 600
  font-size: 12px
  border-radius: 2px 2px 0 0
  height: 22px
  &:focus
    outline: none

.options
  position: absolute
  font-weight: 300
  top: 100%
  z-index:1
  cursor: pointer
  user-select: none
  right: 0
  width: 100px
  font-size: 10px
  text-transform: none
  border-radius: 0 0 5px 5px

.option-item
  background: rgb(255,255,255,0.8)
  padding: 2px
  color: black
  &:hover
    background: rgb(0,0,0,0.8)
    color: lightgray

#edit
  text-align: center
  margin: auto
  line-height: 18px

.todo-list
  height: 0
  width: 100%
  background: white
  overflow-y: auto
  overflow-x: hidden
  // padding-right: 5px

.todo-list-selected
  height: calc(var(--card-height) - 29px)

.usage-info
  font-size: 10px
  font-style: italic

.todo-item
  padding: 0 3px
  display: flex
  align-items: center
  width: 100%
  font-size: 12px
  .completed
    text-decoration: line-through
  &>input
    flex: 1 1 auto

</style>
