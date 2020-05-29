<template lang="pug">
  .container(v-if="login")
    transition-group(name="slide-right")
      .side-link(v-for="link in links" :key="link.display" :ref="link.display" @click="activeChildrenGroup=link.display")
        router-link.main-link(:to="link.linkTo"  :disabled="link.disabled")
          Icon(:type="link.iconType")
          span(v-if="link.spanShow") {{link.display}}
        .children(v-if="activeChildrenGroup==link.display")
          router-link.children-link(v-for="child in link.children" :key="link.display+child.display" :to.stop="child.linkTo" :disabled="child.disabled")
            Icon(:type="child.iconType")
            span(v-if="child.spanShow") {{child.display}}
</template>


<script>
import { vxm } from '@/store'
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component()
export default class SideBar extends Vue{

  // mounted(){
  //   let mainlinks = document.getElementsByClassName('side-link')
  //   mainlinks.forEach(element=>{
  //     // let childs = element.childNodes.filter(child=>child.className=='.children-link')
  //     let childNodes = element.querySelectorAll('.children-link')
  //     let children = Array.from(childNodes)
  //     children.forEach(child=>{
  //       element.addEventListener('mouseenter',()=>{
  //         child.style.display = 'block'
  //       })
  //       element.addEventListener('mouseleave',()=>{
  //         child.style.display = 'none'
  //       })
  //     })
  //     // console.log(element)
  //   })
  //   // this.$refs['Todos'][0].addEventListener('mouseenter', ()=>{
  //   //   console.log('focusin')
  //   // })
  // }

  @Prop( {type: Boolean, default: false}) isCollapsed  
  activeChildrenGroup = ''

  get activeUser(){
    return vxm.user.activeUser
  }

  get login(){
    return Boolean(vxm.user.usertoken)
  }

  get links(){
    return [
    {
      display: 'Todos',
      linkTo: {name: 'Todos', params: {username: this.activeUser.username }},
      iconType: "md-clipboard",
      show: this.login,
      spanShow: !this.isCollapsed, 
      disabled: !this.activeUser.account_is_active,
      children: [
        {
          display: 'Favorites',
          linkTo: {name: 'SpecificTodoLists', params: {username: this.activeUser.username, list:'favorites'}},
          iconType: "md-heart",
          show: this.login,
          spanShow: !this.isCollapsed, 
          disabled: !this.activeUser.account_is_active,     
        },
        {
          display: 'My Todos',
          linkTo: {name: 'SpecificTodoLists', params: {username: this.activeUser.username, list:'owned'}},
          iconType: "md-star",
          show: this.login,
          spanShow: !this.isCollapsed, 
          disabled: !this.activeUser.account_is_active,     
        },
        {
          display: 'Shared with me',
          linkTo: {name: 'SpecificTodoLists', params: {username: this.activeUser.username, list:'shared'}},
          iconType: "md-swap",
          show: this.login,
          spanShow: !this.isCollapsed, 
          disabled: !this.activeUser.account_is_active,   
        }
      ]
    },{
      display: 'Management',
      linkTo: {name: 'Users'},
      iconType: "md-people",
      show: this.login,
      spanShow: !this.isCollapsed, 
      disabled: !this.activeUser.is_admin || !this.activeUser.account_is_active,
      children: []
    },{
      display: 'Profile',
      linkTo: {name: 'Profile', params: {username: this.activeUser.username }},
      iconType: "md-person",
      show: this.login,
      spanShow: !this.isCollapsed, 
      disabled: !this.activeUser.account_is_active,
      children: []
    }
  ]
  }
}
</script>

<style lang="sass" scoped>


.container
  font-family: Avenir, Helvetica, Arial, sans-serifx
  font-family: 'Open Sans', sans-serifs
  text-align: center
  color: white
  box-sizing: border-box
  height:100%

.ivu-layout-sider
  background: #0d1821d1 !important 
  background: #0D1821 !important 
  background: #0d1821f5 !important 
  overflow: hidden
  
.side-link
  display: flex
  flex-direction: column
  transition: all .8s ease
  &:hover
    margin-left: 12px


.main-link,.children-link
  // font-family: 'Sarpanch', sans-serif
  padding: 5px
  display: flex
  align-items: center
  justify-content: flex-start
  width: 100%
  font-size: 13px
  color: #eef0f2
  text-align: left
  transition: all .8s ease
  background: #2c3e50
  &>.ivu-icon
    margin: 0 8px 0 5px
  &:hover
    // margin-left: 12px
    background:  rgb(0,0,0,0.1)
    color: lightgray

.main-link
  // z-index: 1

.children-link
  z-index: 0
  &:hover
    margin-left:15px

</style>