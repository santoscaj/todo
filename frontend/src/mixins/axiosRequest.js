
import {Component, Vue} from 'vue-property-decorator'
import {vxm} from '@/store'
import axios from 'axios'


@Component
export default class AxiosRequest extends Vue{
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
            this.statusMessage = response.statusMessage
        }catch(err){
            console.error(err)
            this.errorOccurred = true
            this.status = err.response.status
            this.statusMessage  = err.response.statusMessage
        }
        return response
    }
}