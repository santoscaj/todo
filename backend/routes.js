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

const DESIRED_USER_FIELDS = ['id','username', 'email','is_admin', 'firstName','lastName', 'image_link', 'account_is_active']
const DESIRED_TODO_FIELDS = ['id', 'title','content']
const DESIRED_FIELDS_ALL = [...DESIRED_USER_FIELDS,{todos:[...DESIRED_TODO_FIELDS]}]
const NON_LOGIN_URLS =  ['/login', '/register', '/users/checkuser/', '/users/checkemail/']

// DEFINING FUNCTIONS ////////////////////////////
function generateRandomPassword(numchars){
    let bytes = numchars / 2
    let password = crypto.randomBytes(bytes).toString('hex')
}

async function authenticator(req, res, next){
  if(NON_LOGIN_URLS.findIndex(url=>req.url.includes(url))>-1)
    next()
  else{
    let token = req.get('Authentication')
    if(!token) return res.sendStatus(400)
    token = token.split(' ')[1]
    try{
      let webtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      let queryResults = await User.findOne({where:{id: webtoken.id}})
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
  if(!username) return res.sendStatus(400)

  try{
    let queryResults = await User.findOne({where:{username}})
    if(!queryResults) return res.sendStatus(404)    // Couldnt veirify page

    let userData = queryResults.dataValues
    let authenticatedUser = req.authenticatedUser
    if(userData.id != authenticatedUser.id && !authenticatedUser.is_admin) return sendStatus(403)

    req.user = userData
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
      // let accessToken = jwt.sign({id: dbUser.id, username:dbUser.username}, process.env.ACCESS_TOKEN_SECRET)
      let accessToken = jwt.sign({id: dbUser.id}, process.env.ACCESS_TOKEN_SECRET)
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
      // let accessToken = jwt.sign({id: user.id, username:user.username}, process.env.ACCESS_TOKEN_SECRET)
      let accessToken = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET)
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
    // let accessToken = jwt.sign({id: dbUser.id, username:dbUser.username}, process.env.ACCESS_TOKEN_SECRET)
    let accessToken = jwt.sign({id: dbUser.id}, process.env.ACCESS_TOKEN_SECRET)
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

    let queryResults = await User.findAll({include:Todo})
    allUsers = queryResults.map(u=>cleanObject(u.dataValues, DESIRED_USER_FIELDS))
    res.json(allUsers)
  }catch(e){
    if(e.message == 'invalid token') return res.status(400).send(e.message)
    console.error(e)
  }
})

router.get('/users/:username', getUserInfo, async(req, res)=>{
  let {authenticatedUser, user} = req
  try{
    if(authenticatedUser.username !== user.username) return res.sendStatus(403)
    res.json(cleanObject(authenticatedUser, DESIRED_USER_FIELDS))

  }catch(e){
    if(e.message == 'invalid token') return res.status(400).send(e.message)
    res.sendStatus(500)
    console.error(e)
  }
})

router.get('/todos/:username', getUserInfo ,async (req, res)=>{
  let {authenticatedUser, user } = req
  try{    
    let queryTodos = await Todo.findAll({where:{user_id:user.id}})
    if(!queryTodos) res.sendStatus(204)
    let todos = queryTodos.map(result=> cleanObject(result.dataValues, DESIRED_TODO_FIELDS))
    res.json(todos)
  }catch(e){
    console.error(e)
    if(e.message == 'invalid token') return res.status(400).send(e.message)
    return res.sendStatus(500)
  }
})

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

    // if(user.username != newUpdatedUser.username)
      // newAccessToken = jwt.sign({id: newUpdatedUser.id}, process.env.ACCESS_TOKEN_SECRET)
      // newAccessToken = jwt.sign({id: newUpdatedUser.id, username:newUpdatedUser.username}, process.env.ACCESS_TOKEN_SECRET)

    res.json( cleanObject(newUpdatedUser, DESIRED_USER_FIELDS))
    
  }catch(e){
    console.error(e)
    if(/admin user/.test(e.message))
      return res.status(400).send(e.message)
    return res.sendStatus(500)
  }
})

router.put('/todos/:username/group', getUserInfo, async (req, res)=>{
  let data = req.body
  let { authenticatedUser, user } = req
  try{
    if(!data) return res.sendStatus(400)
    if (user.username!=authenticatedUser.username) return res.sendStatus(403)
    
    for(let todo of data)
      await Todo.update(todo, {where:{id:todo.id}})
    const updatedTodos = await Todo.findAll({ where:{ id: data.map(d => d.id) }})
    res.json(updatedTodos.map(obj=>cleanObject(obj,DESIRED_TODO_FIELDS)))

  }catch(e){
    console.error(e)
    if(/admin user/.test(e.message))
      return res.status(400).send(e.message)
    return res.sendStatus(500)
  }
})

router.delete('/todos/:username/group', getUserInfo, async (req, res)=>{
  let {user, authenticatedUser} = req
  let data = req.body
  try{
    if(user.username!== authenticatedUser.username) return res.sendStatus(403)
    for(let todo of data)
      await Todo.destroy(todo, {where:{id:todo.id}})

  }catch(e){
    console.error(e)
    if(/Cannot delete.*admin user/.test(e.message))
      return res.status(400).send(e.message)
    return res.sendStatus(500)
  }
})

router.get('/users/checkuser/:username', async (req, res)=>{
  let username = req.params.username
  let queryResults = await User.findOne({where:{username}})
  if(queryResults) return res.status(200).send({result: true})
  res.status(200).send({result: false})
})

router.get('/users/checkemail/:email', async (req, res)=>{
  let email = req.params.email
  let queryResults = await User.findOne({where:{email}})
  if(queryResults) return res.status(200).send({result: true})
  res.status(200).send({result: false})
})

module.exports = router
