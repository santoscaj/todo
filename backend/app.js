const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server);

const bodyParser = require('body-parser')
const {cleanObject} = require('./middleware')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { User } = require('./sq')

const socketConnections  = require('./sockets')(io)



// server.listen(4000);

//routes
const router = require('./routes/index.js')
const todolist = require('./routes/todolists.js')
const user = require('./routes/users.js')

const noLoginRequiredUrls =  ['/login', '/register', '/users/checkuser/', '/users/checkemail/', '/users/reset_password/', '/session']

async function authenticator(req, res, next){
    if(noLoginRequiredUrls.findIndex(url=>req.url.includes(url))>-1)
        next()
    else{
        let token = req.get('Authentication')
        if(!token) return res.sendStatus(400)
        token = token.split(' ')[1]
        try{
            let webtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            let authenticatedUser = await User.findOne({where:{id: webtoken.id}})
            if (!authenticatedUser) return res.sendStatus(401)
            req.authenticatedUser = authenticatedUser
            next()
        }catch(e){
            if(e.message == 'invalid token') return res.status(400).send(e.message)
        }
    }
}

/**
 * Intercepts the json response before sending information the to frontend to only include what is going to be handled by the front end
 * removes password_hash, created_at, updated_at, ...
 */

function dataCleaner(req, res, next){
    let originalJson = res.json
    res.json = function(data){
        let modifiedData = data
        for(let [field, value] of Object.entries(modifiedData))
            modifiedData[field] = cleanObject(value, field)
        arguments[0] = modifiedData
        originalJson.apply(res, arguments);
    }
    next()
}

// app.use(cors({origin:'http://localhost:8080'}))


let allowedOrigins = [
    'http://localhost','http://localhost:8080','http://localhost:80', 
    'https://todolist.santosaj.com', 'http://todolist.santosaj.com'
	]

app.use(cors({origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }

}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(dataCleaner)
app.use(authenticator)

app.use(router)
app.use(todolist)
app.use(user)

const port = process.env.PORT || 4000
server.listen( port, ()=>{
    console.log(`listening on port ${port}`)
})

