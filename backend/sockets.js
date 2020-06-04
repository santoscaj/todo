const v4 = require('uuid')

let activeConnections = []

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
        
        socket.on('disconnect', function(){
            let index = activeConnections.indexOf(socket)
            activeConnections.splice(index, 1)
            console.log(`Disconnected socket ${socket.id}! active connections ${io.sockets.clients()}`)            
        });

        socket.on('login', function(data){
            console.log('logged in user')
            if(!data.token, !data.id, !data.username, !data.email)
                socket.disconnect('did not provide data')
            socket.activeUser = data
            checkDuplicate(socket)
        })
        // socket.emit('disconnect')

    });
}