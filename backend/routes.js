require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {User, Todo, Sequelize} = require('./sq')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cleanObject = require('./utils/cleanData')

const DESIRED_USER_FIELDS = ['id','username', 'email','is_admin', 'firstName','lastName', 'image_link']
const DESIRED_TODO_FIELDS = ['id', 'title','content']
const DESIRED_FIELDS_ALL = [...DESIRED_USER_FIELDS,{todos:[...DESIRED_TODO_FIELDS]}]

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    res.send('Hello Berto')
})
  
router.get('/users',async (req, res)=>{
    try{
      let users = await User.findAll({include:[Todo]})
      res.json(cleanObject(users, DESIRED_FIELDS_ALL))
    }catch(e){
      console.error(e)
    }
})
  
router.get('/user/:id',async (req,res)=>{
    let id = req.params.id
    try{
      let user = await User.findOne({where:{id}, include: [Todo]})
      let cleanObj = cleanObject(user.dataValues,DESIRED_FIELDS_ALL)
      res.json(cleanObj)
    }catch(e){
      console.error(e)
    }   
})

router.post('/register',async (req, res)=>{
    let newUser = req.body
    try{
        let hashedPassword = await (bcrypt.hashSync(newUser.password, 5))
        newUser.password = hashedPassword
        let user = (await User.create(newUser)).dataValues
        let accessToken = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).send({auth: true, accessToken, user})
    }catch(err){
        let error = err.errors[0]
        if(error.type==='notNull Violation' || error.type==='unique violation')
          return res.status(400).send(error.message)
        return res.sendStatus(500)
    }
})


module.exports = router