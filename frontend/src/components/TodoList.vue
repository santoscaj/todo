
<template lang="pug">

.mycontainer(ref="container" :class="{hover: hover, card:cardsStyle, tile:!cardsStyle}" @click.stop="titleClicked()")
  .title
    input.title-input(v-model="todo.title" :disabled="!edit")
    .title-btns-area
      Button.mini-btn(v-if="!edit" ref="edit-btn" type="warning" size="small" @click.stop="changeEdit()" :class="{'bigger-btn':makeBtnBigger}")
        Icon(type="md-create")
      Button.mini-btn(v-if="edit" type="success" size="small" @click.stop="changeEdit()")
        Icon(type="md-checkmark")
    button.mini-btn#options(size="small" @click.stop="showMiniMenu()" :class="{'light-background': miniMenu}")
      Icon(type="md-more")
    .options(v-if="miniMenu")
      .option-item(v-for="option in options" :key="option.name" @click="option.call") {{option.name}}
  .todo-list(:style="{'pointer-events': edit? 'auto': 'none'}" :class="{'todo-list-selected': displayBody}")
    .todo-item(v-for="item in todo.items" :key="item.id")
      checkbox(v-model="item.completion")
      input(:class="{completed:item.completion}" v-model="item.content")
      button.mini-btn.close-btn
        Icon(type="md-close")
    .todo-item
      .space
      button.mini-btn
        Icon(type="md-add")
    //- Input(type="textarea" :rows="10" v-model="draft.content" style="width: 200px" ) 

</template>

<script lang="ts">
//@ts-nocheck
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TodoList extends Vue {
  // @Prop() private msg!: string;

  edit=false
  hover=false
  makeBtnBigger=false
  miniMenu=false
  selected=false

  get cardsStyle(){
    return true                                             
  }

  get displayBody(){
    return this.cardsStyle || this.selected
  }

  changeEdit(){
    this.edit= !this.edit
  }

  showMiniMenu(){
    let currentState = this.miniMenu
    this.miniMenu = !currentState
    if(!currentState)
      window.addEventListener('click', ()=>{this.miniMenu = false}, {once:true})
      this.$refs.container.addEventListener('click', ()=>{this.miniMenu = false}, {once:true})
  }

  sendError(err){
    this.$emit('error', err)
  }

  titleClicked(){
    if(!this.edit){
      this.makeBtnBigger = true
      setTimeout(()=>{this.makeBtnBigger = false},250)
    }

    this.selected = true
    window.addEventListener('click', ()=>{this.selected = false}, {once:true})
  }

  change(){
    return function(eventType){
      console.log(eventType)
      this.$emit('change', eventType)
    }
  }

  // share(){
  //   console.log('sharing')
  //   this.$emit('share')
  // }

  // delete(){
  //   console.log('deleting')
  //   this.$emit('delete')
  // }

  // removeCompleted(){
  //   console.log('removing completed')
  //   this.$emit('completed')
  // }
  
  // duplicate(){
  //   console.log('duplicating')
  //   this.$emit('duplicate')
  // }

  options = [
    {
      name: 'share settings',
      call: this.change('share')
    },
    {
      name: 'remove completed',
      call: this.change('completed')
    },
    {
      name: 'duplicate list',
      call: this.change('duplicate')
    },
    {
      name: 'delete list',
      call: this.change('delete')
    },
  ]

  todo = {
    id: 1, 
    title: 'car brands',
    shared: ['juan', 'jose', 'maria'],
    items: [
      {         id:1,         completion: false,         content: 'tesla'       },       {         id:2,         completion: true,         content: 'honda'       },       {         id:3,         completion: false,         content: 'toyota'       },       {         id:4,         completion: false,         content: 'mazda'       },       {         id:5,         completion: false,         content: 'mercedes'       },       {         id:6,         completion: true,         content: 'skoda'       },             {         id:7,         completion: false,         content: 'mazda'       },       {         id:15,         completion: false,         content: 'mercedes'       },       {         id:61,         completion: true,         content: 'skoda'       },             {         id:14,         completion: false,         content: 'mazda'       },       {         id:185,         completion: false,         content: 'mercedes'       },       {         id:1116,         completion: true,         content: 'skoda'       },             {         id:1114,         completion: false,         content: 'mazda'       },       {         id:11115,         completion: false,         content: 'mercedes'       },       {         id:11116,         completion: true,         content: 'skoda'       },
    ]
  }

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
  width: 250px

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
  height: 260px

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