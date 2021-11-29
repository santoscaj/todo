const v4 = require('uuid')

let activeConnections = []
// lists that are being used by some users and should be locked for other users
let lockedLists = [{
    listId: '',
    username: '',
    socketId: '',
}]   
// pages that are being used by specific users
let lockedPages = [{
    pageName: '',
    username: '',
    socketId: ''
}]      

function removeEverythingLockedBySocket(socketId){    
    lockedLists = lockedLists.filter(item=>item.socketId !=socketId)
    lockedPages = lockedPages.filter(item=>item.socketId !=socketId)
}

function lockList(listData){
    if(!listData.listId || !listData.username || !listData.socketId)
        return console.error('ERROR! one or more lockedList datafields are missing')
    let connectionIndex = activeConnections.findIndex(connection=>connection.id==listData.socketId)
    if(connectionIndex == -1)
        return console.error(`ERROR! socket ${listData.socketId} attempted to lock a list but it was no active connections`)
    let lockedListIndex = lockedLists.findIndex(list=>list.listId==listData.listId)
    if(lockedListIndex==-1)
        lockedLists.push(listData)
    else{
        console.error(`socket ${listData.socketId} attempted to lock list resource ${listData.listData} but it is currently locked`)
    }
}

function releaseList(listData){
    let index = lockedLists.indexOf(listData)
    if(index>-1)
        lockedLists.splice(index, 1)
}

function lockPageForUser(pageData){
    if(!pageData.pageName || !pageData.username || !pageData.socketId)
        return console.error('ERROR! one or more required pagelock datafields are missing')
    let connectionIndex = activeConnections.findIndex(connection=>connection.id==pageData.socketId)
    if(connectionIndex == -1)
        return console.error(`ERROR! socket ${pageData.socketId} attempted to lock a page but it was no active connections`)
    let lockedPageIndex = lockedPages.findIndex(item=>item.pageName==pageData.pageName && item.username == pageData.username)
    if(lockedPageIndex==-1)
        lockedPages.push(pageData)
    else{
        console.error(`socket ${listData.socketId} attempted to lock list resource ${listData.listData} but it is currently locked`)
    }
}

function releasePageForUser(pageData){
    let index = lockedLists.indexOf(listData)
    if(index>-1)
        lockedLists.splice(index, 1)
}

function disconnectSockets(sockets, event){
    if(!sockets || sockets.length == 0)
        return
    sockets.forEach(socket=>{
        if(event)
            socket.emit(event)

        console.log(`Disconnecting socket ${socket.id} --- `, event)
        socket.disconnect('hellow')
        index = activeConnections.indexOf(socket)
        // if(index>-1) activeConnections.splice(index, 1)
    })
}

function checkDuplicate(socket){
    let duplicateSessions = activeConnections.filter(s=>{
        if(!s.activeUser)
            return false
        return s.activeUser.username == socket.activeUser.username && s.activeUser.token != socket.activeUser.token
        })

    disconnectSockets(duplicateSessions, 'duplicate')
}

function checkInactiveSessions(){
    let inactiveSessions = activeConnections.filter(socket=>!socket.activeUser)            
    disconnectSockets(inactiveSessions, 'inactive')
}

setInterval(checkInactiveSessions,10000)


module.exports = function(io){
    setInterval(()=>{
        console.log('connected: ===========================================')
        console.log(Object.keys(io.sockets.connected))
        console.log('======================================================')
    }, 15000)
    io.on('connection', socket => { 
        activeConnections.push(socket)
        console.log(`Connected socket ${socket.id}! active connections ${io.sockets.clients()}`)
        
        // socket functions 
        socket.on('disconnect', function(){
            let index = activeConnections.indexOf(socket)
            activeConnections.splice(index, 1)
            removeEverythingLockedBySocket(socket.id)
            console.log(`Disconnected socket ${socket.id}! active connections ${io.sockets.clients()}`)            
        });

        socket.on('login', function(data){
            console.log('logged in user')
            if(!data.token, !data.id, !data.username, !data.email)
                socket.disconnect('did not provide data')
            socket.activeUser = data
            checkDuplicate(socket)
        })
        
        socket.on('lock list', (data)=>{
            let lockedData = {...data, socketId: socket.id}
            lockList(lockedData)
        })

        socket.on('release page', (data)=>{
            let lockedData = {...data, socketId: socket.id}
            releaseList(lockedData)
        })
        
        socket.on('lock page', (data)=>{
            let lockedData = {...data, socketId:socket.id}
            lockPageForUser(lockedData)
        })

        socket.on('release page', (data)=>{
            let releaseData = {...data, socketId:socket.id}
            releasePageForUser(releaseData)
        })
    });
}