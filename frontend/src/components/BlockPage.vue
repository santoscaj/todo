<template lang="pug">
.block
    .message 
        p(v-for="(line, index) in lines" :key="index") {{line}}
            span.typing#dot1(v-if="index == Object.keys(lines).length - 1") .
            span.typing#dot2(v-if="index == Object.keys(lines).length - 1") .
            span.typing#dot3(v-if="index == Object.keys(lines).length - 1") .
</template>


<script>
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'

@Component()
export default class BlockPage extends Vue{

@Prop( {type: String, default: ''}) message  

get lines(){
    return this.message.split('\n')
}

}
</script>

<style lang="sass">

.block
  position: absolute
  background: rgb(0,0,0,0.2)
  display: flex
  justify-content: center
  align-items: center
  z-index: 50
  top: 0
  bottom: 0
  left: 0
  right: 0
  // width: 100%
  // height: calc(100vh - var(--header-size))

  .message
    padding: 5px
    background: rgb(255,255,255,0.8)
    font-size: 12px
    border-radius: 5px

.typing
  animation-name: dots
  animation-duration: 2s
  animation-iteration-count: infinite
  animation-timing-function: ease-in-out
  opacity: 0

@keyframes dots
  10%
    opacity: 1

#dot2
  animation-delay: .3s

#dot3
  animation-delay: 0.6s
</style>