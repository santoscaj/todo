import config from '@/config'

import io from 'socket.io-client'
import Vue from  'vue'
import {vxm} from './store'


export default class Socket {
    socketIO : any
    listsBeingEdited = []
    isConnected = false
    isDuplicate = false
    lockPages = {
        'Todos' : false,
        'Profile' : false,
        'Users' : false,
    }

    connect(userData: any){
        if(!userData.id || !userData.username || !userData.email || !userData.token)
            throw 'user id, username and email must be specified to connect to socket'
        this.socketIO.connect()
        this.socketIO.emit('login', userData)
    }

    lockPage(pageName:string, username:string){
        if(!pageName || !username)
            throw 'must specify page name and username to lock'
        this.socketIO.emit('lock page', {pageName, username})
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
        })

        this.socketIO.on('duplicate',()=> {
            this.isDuplicate = true
            window.localStorage.removeItem('token')
            window.localStorage.removeItem('username')
            vxm.user.logout()
        })

        this.socketIO.on('lock page',(data: any)=> {
            let {pageName, socketId} = data
            //@ts-ignore
            this.lockPages[pageName] = socketId != this.socketIO.id
        })
    }
}

export const socket = Vue.observable(new Socket())