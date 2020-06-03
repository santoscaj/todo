import config from '@/config'

import io from 'socket.io-client'

// const socket = io(config.server.BASE_SERVER_URL)

// socket.on('connect', function(){
//     console.log('connected')
// })

// socket.on('disconnect', function(){
//     console.log('disconnected')
// })



// const Socket = {
//     install: function(Vue: any){
//         Vue.prototype.$socket = socket

//         Vue.prototype.socket = {
//             isConnected: false
//         }
//     }
// }

// export default Socket

export default class Socket {
    socketIO : any
    isConnected : boolean
    isDuplicate : boolean

    login(userData: any){
        this.socketIO.emit('login', userData)
    }

    constructor(){
        this.isConnected = false
        this.isDuplicate = false
        this.socketIO = io(config.server.BASE_SERVER_URL)
        this.socketIO.on('connect',()=> this.isConnected = true)
        this.socketIO.on('disconnect',()=> this.isConnected = false)
    }

    install(Vue:any){
        Vue.prototype.$socket = this.socketIO
        Vue.prototype.socket = this
    }
}