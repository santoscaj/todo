const express = require('express')
const bodyParser = require('body-parser')
const {cleanObject} = require('./middleware')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { User } = require('./sq')

//routes
const router = require('./routes/index.js')
const todolist = require('./routes/todolists.js')
const user = require('./routes/users.js')

const noLoginRequiredUrls =  ['/login', '/register', '/users/checkuser/', '/users/checkemail/', '/users/reset_password/']

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
    let originalSend = res.send
    res.send = function(data){
        // console.log('========================',data)
        // let modifiedData = JSON.parse(data)
        let modifiedData = data

        for(let [field, value] of Object.entries(modifiedData)){
            console.log(field, value)
            modifiedData[field] = cleanObject(value, field)
        }
        arguments[0] = modifiedData
        // arguments[0] = JSON.stringify(modifiedData)
        originalSend.apply(res, arguments);
    }
    next()
}

app.use(cors({origin:'http://localhost:8080'}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(dataCleaner)
app.use(authenticator)

app.use(router)
app.use(todolist)
app.use(user)

app.listen( process.env.PORT || 3000)

