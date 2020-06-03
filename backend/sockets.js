const v4 = require('uuid')

let activeConnections = []
let activeUsers = []

function disconnectSockets(sockets){
    sockets.forEach(socket=>{
        socket.emit('logout')
        socket.emit('duplicate')
    
        let index = activeUsers.indexOf(socket)
        if(index>-1) activeUsers.splice(index, 1)
    
        index = activeConnections.indexOf(socket)
        if(index>-1) activeConnections.splice(index, 1)
    })
}

function checkDuplicate(socket){
    let duplicateSessions = activeUsers.find(s=>{
        return s.username == socket.username && s.token != socket.token
        })
    disconnectSockets(duplicateSessions)
}

module.exports = function(io){
    io.on('connection', socket => { 
        activeConnections.push(socket)
        console.log(`Connected to Web Socket! active connections ${activeConnections.length}`)
        
        socket.on('disconnect', function(){
            let index = activeConnections.indexOf(socket)
            activeConnections.splice(index, 1)
            console.log(`Disconnected Web Socket! active connections ${activeConnections.length}`)            
        });

        socket.on('login', function(data){
            checkDuplicate(socket)
            console.log('adding user', data)
            data.sessionId = v4()
            socket.emit('login', data)
            activeUsers.push(socket)
        })
        // socket.emit('disconnect')

    });
}