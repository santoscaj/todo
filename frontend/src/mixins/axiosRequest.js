
import {Component, Vue} from 'vue-property-decorator'
import {vxm} from '@/store'
import axios from 'axios'
import config from '@/config'


function getRoute(fullPath, params){
    if(!params) return fullPath 
    let path = fullPath.slice(config.server.BASE_SERVER_URL.length,)
    for(let param of Object.keys(params))
        path = path.replace(':'+param,params[param])
    if(path.includes(':'))
        throw new Error(`one or more parameter was not specified in the route ${path}`)
    let newPath = config.server.BASE_SERVER_URL+path
return newPath
}
@Component
export class AxiosGetRequest extends Vue{

    async axiosGetRequest(url, params){
        url = getRoute(url, params)
        let response = null
        try{
            response = await axios.get(url)
        }catch(err){
            throw err
            console.error(err)
        }
        return response
    }
}

@Component
export class AxiosGetRequestStatus extends Vue{
    status = ''
    statusMessage = ''
    errorOccurred = false
    
    async axiosGetRequest(url, params){
        url = getRoute(url, params)
        let response = null
        try{
            response = await axios.get(url)
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
    async axiosPutRequest(url, params, data, messageOnSuccess=null){
        url = getRoute(url, params)
        let response = null
        try{
            response = await axios.put(url, data)
            if(messageOnSuccess) this.$Message.success(messageOnSuccess)
        }catch(err){
            console.dir(err)
            let statusMessage = err.response.data ?  err.response.data : err.response.statusText
            if(messageOnSuccess) this.$Message.error(statusMessage)
            throw err
        }
        return response
    }
}

@Component
export class AxiosDeleteRequest extends Vue{
    async axiosDeleteRequest(url, params, data ){
        url = getRoute(url, params)
        let response = null
        try{
            response = await axios.delete(url, data)
        }catch(err){
            throw err
        }
        return response
    }
}


@Component
export class AxiosPostRequest extends Vue{
    async axiosPostRequest(url, params, data ){
        url = getRoute(url, params)
        let response = null
        try{
            response = await axios.post(url, data)
        }catch(err){
            throw err
        }
        return response
    }
}

