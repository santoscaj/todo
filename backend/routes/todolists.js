const express = require('express')
const todolist = express.Router()
const {User, TodoList, TodoListUser , TodoItem} = require('../sq')
const { getUserInfo, checkIfUserOwnsList } = require('../middleware')

// function getTodoListId(req, res, next){
//     let todolist_id = req.params.todolist_id
//     if(!todolist_id) return res.sendStatus(400)
//     req.todolist_id = todolist_id
//     next()
// }

todolist.get('/users/:username/todolists', getUserInfo , async (req, res)=>{
  try{
    let ownedTodos = await TodoList.findAll({
      where:{
        user_id: req.pageOwner.id
      }, 
      include: 
        TodoItem 
      })
    let sharedTodos = await TodoList.findAll({
      include: [
        {
          model: User, 
          as: 'users', 
          attributes: ['id'],
          where:{id:req.pageOwner.id}
        }, 
        TodoItem
      ]
    })
    if(!ownedTodos && !sharedTodos) res.sendStatus(404)
    res.json({shared: sharedTodos, owned: ownedTodos})
  }catch(e){
    console.error(e)
    return res.sendStatus(500)
  }
})
  
todolist.delete('/users/:username/todolists/:todolist_id', getUserInfo , async (req, res)=>{
  try{
    let todolist_id = req.params.todolist
    if(!todolist_id) return res.sendStatus(400)
    let deletedList = await TodoList.destroy({where:{id: todolist_id, user_id: req.pageOwner.id}})
    if(!deletedList) return res.sendStatus(404)
    res.sendStatus(200)
  }catch(e){
    console.error(e)
    return res.sendStatus(500)
  }
})
  
todolist.post('/users/:username/todolists/', getUserInfo , async (req, res)=>{
  try{
      let todolist = req.body
      let createdList = await TodoList.create(todolist, {
        include: [{
          model: TodoItem, 
          as: 'todoitems'
        }, { 
          model: TodoListUser, 
          as: 'shared_users'
        }]
      })
      return res.json({todoList:createdList})
  }catch(e){
      console.error(e)
      return res.sendStatus(500)
  }
})


todolist.get('/todolists/:todolist_id/shared', checkIfUserOwnsList , async (req, res)=>{
  try{
    let users = await TodoListUser.findAll({where:{todolist_id: req.todolist_id}})
    res.json({users})
  }catch(e){
    console.error(e)
    return res.sendStatus(500)
  }
})
  
todolist.delete('/todolists/:todolist_id/shared/:email', checkIfUserOwnsList , async (req, res)=>{
  try{
    let {todolist_id, email } = req.params
    let user = await User.findOne({where:{email}})
    if(!user) return res.sendStatus(404)
    let deleteResult = await TodoListUser.destroy({where:{user_id:user.id, todolist_id}})
    if(!deleteResult) res.sendStatus(404)
    res.sendStatus(200)
    
  }catch(e){
    console.error(e)
    return res.sendStatus(500)
  }
})
  
todolist.post('/todolists/:todolist_id/shared/', checkIfUserOwnsList , async (req, res)=>{
  try{
    let {todolist_id} = req.params
    let email = req.body.email
    let user = await User.findOne({where:{email}})
    if(!user) return res.sendStatus(404)
    let newSharedList = await TodoListUser.create({todolist_id, user_id:user.id})
    res.json(newSharedList)
  }catch(e){
    console.error(e)
  }
})
  
module.exports = todolist