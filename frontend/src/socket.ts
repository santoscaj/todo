import config from '@/config'

import io from 'socket.io-client'
import Vue from  'vue'
import {vxm} from './store'
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
    listsBeingEdited = []
    isConnected = false
    isDuplicate = false
    lockPages = {
        'Todos' : false,
        'Todos' : false,
        'Todos' : false,
    }

    connect(userData: any){
        if(!userData.id || !userData.username || !userData.email || !userData.token)
            throw 'user id, username and email must be specified to connect to socket'
        this.socketIO.connect()
        this.socketIO.emit('login', userData)
    }

    lockPage(pageName:string, username:string){

    }

    lockList(listId:number, username: string){
        if(!listId || !username)
            throw 'must specify list id and username to lock'
        this.socketIO.emit('lock list', {listId, username})
    }
    releaseList(listId:number, username: string){
        if(!listId || !username)
            throw 'must specify list id and username to release2'
        this.socketIO.emit('release list', {listId, username})
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
        })

        this.socketIO.on('duplicate',()=> {
            this.isDuplicate = true
            window.localStorage.removeItem('token')
            window.localStorage.removeItem('username')
            vxm.user.logout()
            console.log('duplicate homeboy')
        })
    }
}

export const socket = Vue.observable(new Socket())