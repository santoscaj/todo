
import {Component, Vue} from 'vue-property-decorator'
import {vxm} from '@/store'
import axios from 'axios'


function getRoute(url, params){
    for(let param of Object.keys(params)){
    url = url.replace(':'+param,params[param])
    }
    console.log(url)
    if(url.includes(':'))
        throw new Error('one or more parameter was not specified in the route')
return url
}
@Component
export class AxiosGetRequest extends Vue{
    status = ''
    statusMessage = ''
    errorOccurred = false
    
    async axiosGetRequest(getUrl){
        let response = null
        try{
            response = await axios.get(getUrl)
            this.status = response.status
            this.statusMessage = response.statusText
        }catch(err){
            console.error(err)
            this.errorOccurred = true
            this.status = err.response.status
            this.statusMessage  = err.response.data ?  err.response.data : err.response.statusText
        }
        return response
    }
}

@Component
export class AxiosPutRequest extends Vue{
    async axiosPutRequest(getUrl, data, messageOnSuccess= 'Modified user successfully'){
        let response = null
        try{
            response = await axios.put(getUrl, data)
            this.$Message.success(messageOnSuccess)
        }catch(err){
            console.dir(err)
            let statusMessage = err.response.data ?  err.response.data : err.response.statusText
            this.$Message.error(statusMessage)
        }
        return response
    }
}

@Component
export class AxiosDeleteRequest extends Vue{
    async axiosDeleteRequest(getUrl, data ){
        let response = null
        try{
            response = await axios.put(getUrl, data)
        }catch(err){
            console.dir(err)
        }
        return response
    }
}

