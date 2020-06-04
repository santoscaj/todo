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
    listsBeingEdited: String[]

    connect(userData: any){
        if(!userData.id || !userData.username || !userData.email || !userData.token)
            throw 'user id, username and email must be specified to connect to socket'
        
        this.socketIO.connect()
        this.socketIO.emit('login', userData)
    }

    disconnect(userData: any){
        this.socketIO.disconnect()
    }

    constructor(){
        this.isConnected = false
        this.isDuplicate = false
        this.listsBeingEdited = []
        this.socketIO = io(config.server.BASE_SERVER_URL, {autoConnect:false})
        this.socketIO.on('connect',()=> this.isConnected = true)
        this.socketIO.on('disconnect',()=> {
            this.isConnected = false
            console.log('disconnecting socket ')
            // this.socketIO.disconnect()
        })
        this.socketIO.on('duplicate',()=> {
            this.isDuplicate = true
            window.localStorage.removeItem('token')
            window.localStorage.removeItem('username')
        console.log('duplicate homeboy')})
    }

    install(Vue:any){
        Vue.prototype.$socket = this.socketIO
        Vue.prototype.socket = this
    }
}