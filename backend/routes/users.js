
const express = require('express')
const user = express.Router()
const {User, TodoList, TodoListUser , TodoItem} = require('../sq')
const { getUserInfo } = require('../middleware')

user.get('/users', async (req, res)=>{
  try{
    let authenticatedUser = req.authenticatedUser
    if(!authenticatedUser.is_admin) return res.sendStatus(404)

    let allUsers = await User.findAll()
    res.json(allUsers)
  }catch(e){
    if(e.message == 'invalid token') return res.status(400).send(e.message)
    console.error(e)
  }
})

user.get('/users/:username', getUserInfo, async(req, res)=>{
  let authenticatedUser = req.authenticatedUser
  let user = req.pageOwner
  try{
    if(authenticatedUser.username !== user.username) return res.sendStatus(404)
    res.json({user: authenticatedUser})

  }catch(e){
    if(e.message == 'invalid token') return res.status(400).send(e.message)
    res.sendStatus(500)
    console.error(e)
  }
})

user.delete('/users/:username', getUserInfo, async (req, res)=>{
  let user = req.pageOwner

  try{
    let userDeletedResults = await User.destroy({where:{username: user.username}})
    res.json(userDeletedResults)
  }catch(e){
    console.error(e)
    if(/admin user/.test(e.message))
      return res.status(400).send(e.message)
    return res.sendStatus(500)
  }
})

user.put('/users/:username', getUserInfo,async (req, res)=>{
  let user = req.pageOwner
  let data = req.body
  if( !data) return res.sendStatus(400)

  try{
    await User.update(data, {where:{username:user.username}})
    let newUpdatedUser = await User.findOne({where:{id:user.id}})
    res.json(newUpdatedUser)
    res.json({user:newUpdatedUser})
    
  }catch(e){
    console.error(e)
    if(/admin user/.test(e.message))
      return res.status(400).send(e.message)
    return res.sendStatus(500)
  }
})

module.exports = user
