
import {Component, Vue} from 'vue-property-decorator'
import {vxm} from '@/store'
import axios from 'axios'


@Component
export class AxiosGetRequest extends Vue{
    status = ''
    statusMessage = ''
    errorOccurred = false
    
    async axiosGetRequest(getUrl){
        let response = null
        let token = vxm.user.usertoken
        let config = {headers:{Authentication: `Bearer ${token}`}}
        try{
            response = await axios.get(getUrl, config)
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
        let token = vxm.user.usertoken
        let config = {headers:{Authentication: `Bearer ${token}`}}
        try{
            response = await axios.put(getUrl, data, config)
            this.$Message.success(messageOnSuccess)
        }catch(err){
            console.dir(err)
            let statusMessage = err.response.data ?  err.response.data : err.response.statusText
            this.$Message.error(statusMessage)
        }
        return response
    }
}
