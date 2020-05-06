
let BASE_SERVER_URL="http://localhost:3000"
let BASE_CLIENT_URL="http://localhost:8080"

const server ={
    BASE_SERVER_URL : BASE_SERVER_URL,
    LOGIN_URL:BASE_SERVER_URL+"/login",
    REGISTER_URL:BASE_SERVER_URL+"/register",
    USERS_URL: BASE_SERVER_URL+"/users",
    TODOS_URL: BASE_SERVER_URL+"/todos",
    TOKENS_URL: BASE_SERVER_URL+"/usertoken",
}

const client ={
    BASE_CLIENT_URL : BASE_CLIENT_URL,
    LOGIN_URL:"/login",
    REGISTER_URL:"/register",
    USERS_URL: "/users",
    TODOS_URL: "/todos",
    TOKENS_URL: "/usertoken",
}


module.exports = { server, client }