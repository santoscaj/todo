require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {User, TodoList, TodoItem, TodoListUser, Sequelize, sequelize } = require('../sq')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cleanObject = require('../utils/cleanData')
let crypto = require('crypto')
const activeUsersTokens = require('../utils/activeUsersTokens')
const {sendUserPasswordEmail} = require('../utils/emailSender')

const DESIRED_USER_FIELDS = ['id','username', 'email','is_admin', 'firstName','lastName', 'image_link', 'account_is_active']
const DESIRED_TODO_FIELDS = ['id', 'title','content']
const DESIRED_FIELDS_ALL = [...DESIRED_USER_FIELDS,{todos:[...DESIRED_TODO_FIELDS]}]
const NON_LOGIN_URLS =  ['/login', '/register', '/users/checkuser/', '/users/checkemail/', '/users/reset_password/']
const SALT = Number(process.env.SALT)

function generateRandomPassword(numchars){
    let bytes = numchars / 2
    let password = crypto.randomBytes(bytes).toString('hex')
    return password
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
      let authenticatedUser = await User.findOne({where:{id: webtoken.id}})
      if (!authenticatedUser) return res.sendStatus(401)
      req.authenticatedUser = authenticatedUser

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
    let userData = await User.findOne({where:{username}})
    if(!userData) return res.sendStatus(404)    // Couldnt veirify page

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

router.post('/register-admin',async (req, res)=>{
  let newUser = req.body
  try{
      let hashedPassword = await (bcrypt.hashSync(newUser.password, SALT))
      newUser.password = hashedPassword
      newUser.is_admin = true
      let dbUser = await User.create(newUser)
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
      let hashedPassword = await (bcrypt.hashSync(newUser.password, SALT))
      newUser.password = hashedPassword
      let user = await User.create(newUser)
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


router.post('/users/:username/change_password', getUserInfo, async (req, res)=>{
  let user = req.user
  let { oldPassword, newPassword} = req.body

  if(!oldPassword|| !newPassword)  return res.sendStatus(400)
  if(!bcrypt.compareSync(oldPassword,user.password)) return res.status(401).send('wrong password')
  let newPassHash = bcrypt.hashSync(newPassword, SALT)
  await User.update({password: newPassHash},{where:{id:user.id}})
  res.sendStatus(200)
})

router.post('/users/reset_password/:email', async (req, res)=>{
  let email = req.params.email
  if(!email) return res.sendStatus(400)

  let userData = await User.findOne({where:{email}})
  if(!userData) return res.sendStatus(404)
  let newPassword = generateRandomPassword(16)

  sendUserPasswordEmail(userData, newPassword)

})


router.post('/login', async (req, res)=>{
  let userData = req.body
  try{
    let dbUser = await User.findOne({where: {username: userData.username}})

    if(!dbUser)
      return res.sendStatus(404)
    if(!bcrypt.compareSync(userData.password,dbUser.password))
      return res.sendStatus(401)
    let accessToken = jwt.sign({id: dbUser.id}, process.env.ACCESS_TOKEN_SECRET)
    res.status(200).send({auth:true, accessToken, dbUser})

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
