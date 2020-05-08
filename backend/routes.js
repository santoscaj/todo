require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {User, Todo, Sequelize} = require('./sq')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cleanObject = require('./utils/cleanData')
const activeUsersTokens = require('./utils/activeUsersTokens')

const DESIRED_USER_FIELDS = ['id','username', 'email','is_admin', 'firstName','lastName', 'image_link']
const DESIRED_TODO_FIELDS = ['id', 'title','content']
const DESIRED_FIELDS_ALL = [...DESIRED_USER_FIELDS,{todos:[...DESIRED_TODO_FIELDS]}]

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());



router.delete('/usertoken', (req, res)=>{
  let token = req.body.token
  if(activeUsersTokens.removeToken(token))
    return res.sendStatus(200)
  return res.sendStatus(404)
})

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

// Implemented routes

router.post('/register',async (req, res)=>{
  let newUser = req.body
  try{
      let hashedPassword = await (bcrypt.hashSync(newUser.password, 5))
      newUser.password = hashedPassword
      let queryResult = await User.create(newUser)
      let user = queryResult ? queryResult.dataValues : null
      let accessToken = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET)
      res.status(200).send({auth: true, accessToken, user})
  }catch(err){
      let error = err.errors[0]
      if(error.type==='notNull Violation')
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
    let accessToken = jwt.sign({id: dbUser.id}, process.env.ACCESS_TOKEN_SECRET)
    res.status(200).send({auth:true, accessToken, user})

  }catch(e){  
    console.error(e)
    return res.sendStatus(500)
  }
  
})


/**
 * Users and admins have access to see the Todos of the user 
 */
router.get('/users/:pageOwner/todos',async (req, res)=>{
  let pageOwner = req.params.pageOwner
  let token = req.get('Authentication')
  if(!token || !pageOwner) return res.sendStatus(400)
  token = token.split(' ')[1]
  try{    
    let webtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if(!webtoken) return res.sendStatus(400)
    console.log(webtoken)
    let id = webtoken.id
    let queryPageInfo = await User.findOne({where:{username:pageOwner}, include: Todo})
    let queryUserInfo = await User.findOne({where:{id}})

    if(!queryPageInfo) return res.sendStatus(404)     // Couldnt verify page being accessed
    if(!queryUserInfo) return res.sendStatus(401)     // Couldnt verify user accessing the page
    
    if((queryPageInfo.dataValues.username !== queryUserInfo.dataValues.username) && !queryUserInfo.dataValues.is_admin)
      return res.sendStatus(403)
    res.json(cleanObject(queryPageInfo.dataValues, DESIRED_FIELDS_ALL))
  }catch(e){
    if(e.message == 'invalid token') return res.status(400).send(e.message)
    // console.error(e)
    return res.sendStatus(500)
  }
})


///-------------------

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
    let token = req.get('Authentication')
    if(!token) return res.sendStatus(400)

    let webtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if(!webtoken) return res.sendStatus(401)
    let allUsers = await User.findAll({include:Todo})
    res.json(allUsers)
  }catch(e){
    console.error(e)
  }
})



module.exports = router
