import axios from 'axios'

interface Server{
    BASE_SERVER_URL : string;
    LOGIN_URL:string;
    REGISTER_URL:string;
    USERS_URL: string;
    TODOS_URL: string;
    TOKENS_URL: string;
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
    BASE_SERVER_URL : BASE_SERVER_URL,
    LOGIN_URL:BASE_SERVER_URL+"/login",
    REGISTER_URL:BASE_SERVER_URL+"/register",
    USERS_URL: BASE_SERVER_URL+"/users",
    TODOS_URL: BASE_SERVER_URL+"/todos",
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


axios.interceptors.response.use(
    function(response){
        console.log('response from interceptor', response)
      return response
    },
    function(error){
    //   if(error.response.status == 401)
    //     window.location.pathname = '/logout'
    
        return Promise.reject(error)
    }
)

const config : Config = {
    server,
    client
}

export default config

