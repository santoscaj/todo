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
    div.my-flex

</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
@Component
export default class Todos extends Vue {
  search = ""
  dropdown = 5
  dropdownValues = [5,10,20,50,100]

  modifyDropdownValue(newValue){
    this.dropdown = newValue
  }
}
</script>


<style lang="sass" scoped>
.header
  display:flex

.header>*
  width: auto
  
.my-flex
  display: flex
  flex-direction: column

</style>
