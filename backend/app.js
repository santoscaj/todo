const express = require('express')
const cors = require('cors')
const {User, Todo} = require('./sq')


const cleanObject = require('./utils/cleanData')
const desiredUserFields = ['id','username', 'email','password','is_admin', 'firstName','lastName']
const desiredTodoFields = ['id', 'title','content']
const desiredFields = [...desiredUserFields,{todos:[...desiredTodoFields]}]

let app = express()
app.use(cors({origin:'http://localhost:8080'}))

app.get('/', function (req, res) {
  res.send('Hello Berto')
})

app.get('/users',async (req, res)=>{
  try{
    let users = await User.findAll({include:[Todo]})
    res.json(cleanObject(users, desiredFields))
  }catch(e){
    console.error(e)
  }
})

app.get('/user/:id',async (req,res)=>{
  let id = req.params.id
  try{
    let user = await User.findOne({where:{id}, include: [Todo]})
    let cleanObj = cleanObject(user.dataValues,desiredFields)
    res.json(cleanObj)
  }catch(e){
    console.error(e)
  }
    
})

app.listen(3000)