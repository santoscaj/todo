<template lang="pug">
  div
    h1 This is Todos page 
    div.header
      Input.search(suffix="ios-search") 
      Dropdown.dropdown
        Button(type="primary") Item Count
          Icon(type="ios-arrow-down")
        DropdownMenu(slot="list")
          DropdownItem(v-for="item of dropdownValues" :key="item") 
            p(@click="modifyDropdownValue(item)" ) {{item}}
    div.cards-area
      Card.card(v-for="todo in todos" :key="todo.id") 
        p(slot="title") {{todo.title}}
        p(v-for="item in todo.content" :key="item") {{item}}
    div.my-flex

</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import {vxm} from '@/store'

@Component
export default class Todos extends Vue {
  search = ""
  dropdown = 5
  dropdownValues = [5,10,20,50,100]

  get todos(){
    let user = this.$route.params.username
    return vxm.user.getUserTodos(user).map(x=>{
      if(x)
        return {...x, content: x.content.split('\n')}
    })
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
