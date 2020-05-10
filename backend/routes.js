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

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


function generateRandomPassword(numchars){
    let bytes = numchars / 2
    let password = crypto.randomBytes(bytes).toString('hex')
}

// router.delete('/usertoken', (req, res)=>{
//   let token = req.body.token
//   if(activeUsersTokens.removeToken(token))
//     return res.sendStatus(200)
//   return res.sendStatus(404)
// })

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
    token = token.split(' ')[1]
    let webtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    let id = webtoken.id
    let accessingUser = await User.findOne({where:{id}})
    
    if(!accessingUser) return res.sendStatus(401)
    if(!accessingUser.is_admin) return res.sendStatus(403)

    let allUsers = await User.findAll({include:Todo})
    res.json(allUsers)
  }catch(e){
    if(e.message == 'invalid token') return res.status(400).send(e.message)
    console.error(e)
  }
})

router.get('/user/:pageOwner', async(req, res)=>{
  let pageOwner = req.params.pageOwner
  let token = req.get('Authentication')
  if(!token || !pageOwner) res.sendStatus(400)

  try{
    token = token.split(' ')[1]
    let webtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    let id = webtoken.id
    let queryUser = await User.findOne({where:{id}})
    if (!queryUser) return res.sendStatus(401)
    if(queryUser.dataValues.username !== pageOwner) return res.sendStatus(403)
    res.json(cleanObject(queryUser.dataValues, DESIRED_USER_FIELDS))

  }catch(e){
    if(e.message == 'invalid token') return res.status(400).send(e.message)
    res.sendStatus(500)
    console.error(e)
  }
})

// console.log('-===================================================')
// ;((async function(){
//   try{ 
//     let oneField = await User.findAll({attributes: ['username', 'email']})
//     console.log(oneField)
//   }catch(e){
//     // if(e.message == 'cannot bulk delete all admin users')
//     //   console.log('You got what you wnated')
//     // else 
//       console.dir(e)
//   }
// })())


router.get('/users/unique', async (req,res)=>{
  let allFields = sequelize.models.user.rawAttributes
  let uniqueFields = []
  let uniqueFieldsObj = {}
  for(let i of Object.keys(allFields)){
    if(allFields[i].unique) {
      uniqueFields.push(i)
      uniqueFieldsObj[i] = []
    }
  }
  if(uniqueFields.length==0) return res.status(200).send('no unique values')
  try{
    let queryResult = await User.findAll({attributes: uniqueFields})
    if(!queryResult) return res.status(200).send('no unique values')
    queryResult.map(data=> data.dataValues).forEach(user=>{
      uniqueFields.forEach(field=>{
        uniqueFieldsObj[field].push(user[field])
      })
    })

    res.json(uniqueFieldsObj)
  }catch(e){
    console.error(e)
    res.sendStatus(500)
  }
})

router.delete('/users/:username', async (req, res)=>{
  let userToBeDeleted = req.params.username
  let token = req.get('Authentication')
  if(!token || !userToBeDeleted) return res.sendStatus(400)
  token = token.split(' ')[1]

  try{
    let webtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    let userDeleting = webtoken.username
    let queryResult = await User.findOne({where:{username:userDeleting}})
    
    if(!queryResult) return res.sendStatus(401)
    let userDeletingFull = queryResult.dataValues

    if(userToBeDeleted!== userDeleting && !userDeletingFull.is_admin) return res.sendStatus(403)

    let userDeletedResults = await User.destroy({where:{username:userToBeDeleted}})
    res.json(cleanObject(userDeletedResults.dataValues, DESIRED_USER_FIELDS))
    
  }catch(e){
    console.error(e)
    if(/Cannot delete.*admin user/.test(e.message))
      return res.status(400).send(e.message)
    return res.sendStatus(500)
  }
})


router.put('/users/:username', async (req, res)=>{
  let userToBeUpdated = req.params.username
  let data = req.body
  let token = req.get('Authentication')
  if(!token || !userToBeUpdated || !data) return res.sendStatus(400)
  token = token.split(' ')[1]

  try{
    let webtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    let id = webtoken.id

    
    let userToBeUpdatedFull = await User.findOne({where:{username:userToBeUpdated}})
    let userMakingRequest = await User.findOne({where:{id}})

    if (userToBeUpdated!=userMakingRequest.username && !userMakingRequest.is_admin) return res.sendStatus(403)
    let updated = await User.update(data, {where:{username:userToBeUpdated}})

    let newUpdatedUser = await User.findOne({where:{id:userToBeUpdatedFull.dataValues.id}})
    let newAccessToken = token

    if(userToBeUpdated != newUpdatedUser.dataValues.username)
      newAccessToken = jwt.sign({id: newUpdatedUser.id, username:newUpdatedUser.username}, process.env.ACCESS_TOKEN_SECRET)
    
    res.json( {user:cleanObject(newUpdatedUser.dataValues, DESIRED_USER_FIELDS),accessToken:newAccessToken})
    
  }catch(e){
    console.error(e)
    if(/admin user/.test(e.message))
      return res.status(400).send(e.message)
    return res.sendStatus(500)
  }
})


module.exports = router
