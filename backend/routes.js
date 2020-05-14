require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {User, Todo, Sequelize, sequelize} = require('./sq')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cleanObject = require('./utils/cleanData')
let crypto = require('crypto')
const activeUsersTokens = require('./utils/activeUsersTokens')

const DESIRED_USER_FIELDS = ['id','username', 'email','is_admin', 'firstName','lastName', 'image_link']
const DESIRED_TODO_FIELDS = ['id', 'title','content']
const DESIRED_FIELDS_ALL = [...DESIRED_USER_FIELDS,{todos:[...DESIRED_TODO_FIELDS]}]
const NON_LOGIN_URLS =  ['/login', '/register', '/users/unique']

// DEFINING FUNCTIONS ////////////////////////////
function generateRandomPassword(numchars){
    let bytes = numchars / 2
    let password = crypto.randomBytes(bytes).toString('hex')
}

async function authenticator(req, res, next){
  if(NON_LOGIN_URLS.includes(req.url))
    next()
  else{
    let token = req.get('Authentication')
    if(!token) return res.sendStatus(400)
    token = token.split(' ')[1]

    try{
      let webtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      let id = webtoken.id
      let queryResults = await User.findOne({where:{id}})
      if (!queryResults) return res.sendStatus(401)
      req.authenticatedUser = queryResults.dataValues
      next()
    }catch(e){
      if(e.message == 'invalid token') return res.status(400).send(e.message)
    }
  }
}

async function getUserInfo(req, res, next){
  let username = req.params.username
  let pageOwner = req.params.pageOwner

  let userInfo = username || pageOwner
  if(!userInfo) return res.sendStatus(400)

  try{
    let queryResults = await User.findOne({where:{username: userInfo}})
    if(!queryResults) return res.sendStatus(404)    // Couldnt veirify page

    let userData = queryResults.dataValues
    let authenticatedUser = req.authenticatedUser
    if(userData.id != authenticatedUser.id && !authenticatedUser.is_admin) return sendStatus(403)

    req.user = username ? userData : null
    req.pageOwner = pageOwner ? userData : null

    next()
  }catch(e){
    console.error(e)
    return res.sendStatus(500)
  }
}

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(authenticator)

// ROUTES             ////////////////////////////
router.post('/register-admin',async (req, res)=>{
  let newUser = req.body
  try{
      let hashedPassword = await (bcrypt.hashSync(newUser.password, 5))
      newUser.password = hashedPassword
      newUser.is_admin = true
      let queryResult = await User.create(newUser)
      let dbUser = queryResult ? queryResult.dataValues : null
      let accessToken = jwt.sign({id: dbUser.id, username:dbUser.username}, process.env.ACCESS_TOKEN_SECRET)
      res.status(200).send({auth: true, accessToken, user: dbUser})
  }catch(err){
      let error = err.errors[0]
      if(error.type==='notNull Violation')
        return res.status(400).send(error.message)
      else if(error.type==='unique violation')
        return res.status(409).send(error.message)
      return res.sendStatus(500)
  }
})

router.post('/register',async (req, res)=>{
  let newUser = req.body
  try{
      let hashedPassword = await (bcrypt.hashSync(newUser.password, 5))
      newUser.password = hashedPassword
      let queryResult = await User.create(newUser)
      let user = queryResult ? queryResult.dataValues : null
      let accessToken = jwt.sign({id: user.id, username:user.username}, process.env.ACCESS_TOKEN_SECRET)
      res.status(200).send({auth: true, accessToken, user})
  }catch(err){
      let error = err.errors[0]
      if(err.message = 'Validation error: Validation isEmail on email failed')
        return res.status(400).send('Email field not in expected format')
      else if(error.type==='notNull Violation')
        return res.status(400).send(error.message)
      else if(error.type==='unique violation')
        return res.status(409).send(error.message)
      return res.sendStatus(500)
      console.error(err)
  }
})

router.post('/login', async (req, res)=>{
  let userData = req.body
  try{
    let queryResult = await User.findOne({where: {username: userData.username}})
    let dbUser = queryResult ? queryResult.dataValues : null

    if(!dbUser)
      return res.sendStatus(404)
    if(!bcrypt.compareSync(userData.password,dbUser.password))
      return res.sendStatus(401)

    let user = cleanObject(dbUser, DESIRED_USER_FIELDS)
    let accessToken = jwt.sign({id: dbUser.id, username:dbUser.username}, process.env.ACCESS_TOKEN_SECRET)
    res.status(200).send({auth:true, accessToken, user})

  }catch(e){  
    console.error(e)
    return res.sendStatus(500)
  }
  
})


router.get('/activeuser', async (req, res)=>{
  try{
    let token = req.get('Authentication')
    token = token.split(' ')[1]
    let webtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    let user = await User.findOne({where:{id: webtoken.id}})
    res.json(user)
  }catch(err){
    console.dir(err)
    res.status(400).send(err.message)
  }
})

router.get('/users', async (req, res)=>{
  try{
    let authenticatedUser = req.authenticatedUser
    if(!authenticatedUser.is_admin) return res.sendStatus(403)

    let allUsers = await User.findAll({include:Todo})
    res.json(allUsers)
  }catch(e){
    if(e.message == 'invalid token') return res.status(400).send(e.message)
    console.error(e)
  }
})

router.get('/users/:pageOwner', getUserInfo, async(req, res)=>{
  let {authenticatedUser, pageOwner} = req
  try{
    if(authenticatedUser.username !== pageOwner.username) return res.sendStatus(403)
    res.json(cleanObject(authenticatedUser, DESIRED_USER_FIELDS))

  }catch(e){
    if(e.message == 'invalid token') return res.status(400).send(e.message)
    res.sendStatus(500)
    console.error(e)
  }
})

router.get('/todos/:pageOwner', getUserInfo ,async (req, res)=>{
  let {authenticatedUser, pageOwner } = req
  try{    
    let queryTodos = await Todo.findAll({where:{user_id:pageOwner.id}})
    if(!queryTodos) res.sendStatus(204)
    let todos = queryTodos.map(result=> cleanObject(result.dataValues, DESIRED_TODO_FIELDS))
    res.json(todos)
  }catch(e){
    console.error(e)
    if(e.message == 'invalid token') return res.status(400).send(e.message)
    return res.sendStatus(500)
  }
})

// router.get('/users/unique', async (req,res)=>{
//   let allFields = sequelize.models.user.rawAttributes
//   let uniqueFields = []
//   let uniqueFieldsObj = {}
//   for(let i of Object.keys(allFields)){
//     if(allFields[i].unique) {
//       uniqueFields.push(i)
//       uniqueFieldsObj[i] = []
//     }
//   }
//   if(uniqueFields.length==0) return res.status(200).send('no unique values')
//   try{
//     let queryResult = await User.findAll({attributes: uniqueFields})
//     if(!queryResult) return res.status(200).send('no unique values')
//     queryResult.map(data=> data.dataValues).forEach(user=>{
//       uniqueFields.forEach(field=>{
//         uniqueFieldsObj[field].push(user[field])
//       })
//     })

//     res.json(uniqueFieldsObj)
//   }catch(e){
//     console.error(e)
//     res.sendStatus(500)
//   }
// })

router.delete('/users/:username', getUserInfo, async (req, res)=>{
  let {user, authenticatedUser} = req
  
  try{
    let userDeletedResults = await User.destroy({where:{username: user.username}})
    res.json(cleanObject(userDeletedResults.dataValues, DESIRED_USER_FIELDS))
    
  }catch(e){
    console.error(e)
    if(/Cannot delete.*admin user/.test(e.message))
      return res.status(400).send(e.message)
    return res.sendStatus(500)
  }
})


router.put('/users/:username', getUserInfo,async (req, res)=>{
  let {user, authenticatedUser} = req
  let data = req.body
  if( !data) return res.sendStatus(400)

  try{
    await User.update(data, {where:{username:user.username}})
    let newUpdatedUser = await User.findOne({where:{id:user.id}})
    newUpdatedUser = newUpdatedUser.dataValues
    let newAccessToken = req.get('token')

    if(user.username != newUpdatedUser.username)
      newAccessToken = jwt.sign({id: newUpdatedUser.id, username:newUpdatedUser.username}, process.env.ACCESS_TOKEN_SECRET)

    res.json( {user:cleanObject(newUpdatedUser, DESIRED_USER_FIELDS),accessToken:newAccessToken})
    
  }catch(e){
    console.error(e)
    if(/admin user/.test(e.message))
      return res.status(400).send(e.message)
    return res.sendStatus(500)
  }
})



router.put('/todos/:username/group', getUserInfo, async (req, res)=>{
  // let userToBeUpdated = req.params.username
  let data = req.body
  let { authenticatedUser, user } = req

  if(!data) return res.sendStatus(400)

  try{
    if (user.username!=authenticatedUser.username) return res.sendStatus(403)
    
    for(let todo of data){
      await Todo.update(todo, {where:{id:todo.id}})
    }
    const updatedTodos = await Todo.findAll({ where:{ id: data.map(d => d.id) }})
    res.json(updatedTodos.map(obj=>cleanObject(obj,DESIRED_TODO_FIELDS)))
    
  }catch(e){
    console.error(e)
    if(/admin user/.test(e.message))
      return res.status(400).send(e.message)
    return res.sendStatus(500)
  }
})

router.delete('/todos/:username/group', async (req, res)=>{
  let username = req.params.username
  let data = req.body
  let authenticatedUser
  if(!username) return res.sendStatus(400)

  try{
    if(username!== authenticatedUser.username) return res.sendStatus(403)

    for(let todo of data){
      await Todo.destroy(todo, {where:{id:todo.id}})
    }

  }catch(e){
    console.error(e)
    if(/Cannot delete.*admin user/.test(e.message))
      return res.status(400).send(e.message)
    return res.sendStatus(500)
  }
})

module.exports = router
