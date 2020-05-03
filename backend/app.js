const express = require('express')

const router = require('./routes.js')
const app = express()
const cors = require('cors')
// const {User, Todo} = require('./sq')

app.use(cors({origin:'http://localhost:8080'}))
app.use(router)

app.listen(3000)