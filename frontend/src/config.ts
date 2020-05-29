import axios, { AxiosRequestConfig } from 'axios'
import {vxm} from './store'
interface Server{
    BASE_SERVER_URL : string;
    LOGIN_URL:string;
    REGISTER_URL:string;
    USERS_URL: string;
    SHARED_LISTS_URL: string;
    TODOLISTS_URL: string;
    TODOLIST_URL: string;
    PROFILE_URL: string;
    // TODOS_BULK_URL: string;
    CHANGE_PASSWORD: string;
    RESET_PASSWORD: string;
    // TODOS_URL: string;
    TOKENS_URL: string;
    GET_ACTIVE_USER: string;
    // UNIQUE_FIELDS: string;
    CHECK_USER: string;
    CHECK_EMAIL: string;
}

interface Client{
    BASE_CLIENT_URL : string;
    LOGIN_URL:string;
    REGISTER_URL:string;
    USERS_URL: string;
    TODOS_URL: string;
    TOKENS_URL: string;
}

interface Config{
    server: Server;
    client: Client
}

let BASE_SERVER_URL:string="http://localhost:3000"
let BASE_CLIENT_URL:string="http://localhost:8080"

const server :Server ={
    SHARED_LISTS_URL:  BASE_SERVER_URL+'/todolists/:todolist_id/shared',
    TODOLISTS_URL: BASE_SERVER_URL+'/users/:username/todolists',
    TODOLIST_URL: BASE_SERVER_URL+'/users/:email/todolists/:todolist_id',
    BASE_SERVER_URL : BASE_SERVER_URL,
    LOGIN_URL:BASE_SERVER_URL+"/login",
    REGISTER_URL:BASE_SERVER_URL+"/register",
    GET_ACTIVE_USER: BASE_SERVER_URL+"/activeuser",
    USERS_URL: BASE_SERVER_URL+"/users/",
    PROFILE_URL: BASE_SERVER_URL+"/users/:username",
    CHANGE_PASSWORD: BASE_SERVER_URL+"/users/:username/change_password",
    RESET_PASSWORD: BASE_SERVER_URL+"/users/reset_password/:email",
    // UNIQUE_FIELDS: BASE_SERVER_URL+"/users/unique",
    CHECK_USER: BASE_SERVER_URL+"/users/checkuser/:username",
    CHECK_EMAIL: BASE_SERVER_URL+"/users/checkemail/:email",
    // TODOS_URL: BASE_SERVER_URL+"/todos/:username",
    // TODOS_BULK_URL: BASE_SERVER_URL+"/todos/:username/group",
    TOKENS_URL: BASE_SERVER_URL+"/usertoken",
}

const client: Client ={
    BASE_CLIENT_URL : BASE_CLIENT_URL,
    LOGIN_URL:"/login",
    REGISTER_URL:"/register",
    USERS_URL: "/users",
    TODOS_URL: "/todos",
    TOKENS_URL: "/usertoken",
}


axios.interceptors.request.use(
    function (request){
        let nonLoginUrls = [server.LOGIN_URL, server.REGISTER_URL]
        let token = vxm.user.usertoken || localStorage.getItem('token')

        if(!nonLoginUrls.includes(request.url || '') && token)
            request.headers = {...request.headers, Authentication: `Bearer ${token}`}
        return request
    },
    function(error){
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    function(response){
        return response
    },
    function(error){
        return Promise.reject(error)
    }
)

const config : Config = {
    server,
    client
}

export default config

