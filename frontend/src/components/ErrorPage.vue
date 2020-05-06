<template lang="pug">
    div(v-else)
      img.image(:src="image" :alt="status" :key="status")
      p {{statusMessage}}
</template>


<script>
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'

@Component
export default class ErrorMessage extends Vue{
    @Prop([String, Number]) status
    @Prop([String]) statusMessage

    // @Watch('status')
    get image(){
        let images = {
            400: "https://onlinetechnicalhelps.com/wp-content/uploads/2020/02/400-bad-request.png",
            401: "https://static3.bigstockphoto.com/8/8/7/large1500/78864872.jpg",
            403: "https://onlinetechnicalhelps.com/wp-content/uploads/2020/02/403-forbidden.png",
            403: "https://www.worldwidejournals.com/international-journal-of-scientific-research-(IJSR)/images/403-error.gif",
            404: "https://onlinetechnicalhelps.com/wp-content/uploads/2020/02/404-not-found.png",
            409: "https://image.shutterstock.com/image-illustration/http-status-code-409-conflict-260nw-239834038.jpg",
            500: "https://onlinetechnicalhelps.com/wp-content/uploads/2020/02/500-internal-server-error-min.png",
            503: "https://onlinetechnicalhelps.com/wp-content/uploads/2020/02/503-service-unavailable-min.png",
        }
        return images[this.status]
    }

    // @Watch('status')
    // onStatusChange(){

    // }

}
</script>

<style lang="sass">

.image
    width: 300px
    height: 200px

</style>