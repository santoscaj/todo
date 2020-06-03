const express = require('express')
const todolist = express.Router()
const {User, TodoList, TodoListUser , TodoItem, Sequelize} = require('../sq')
const { getUserInfo, checkIfUserOwnsList, getEmailOwnerInfo } = require('../middleware')

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
      ],
      order: [
         'name'
      ]
    })
    if(!ownedTodos && !sharedTodos) res.sendStatus(404)
    res.json({shared: sharedTodos, owned: ownedTodos})


  }catch(e){
    console.error(e)
    return res.sendStatus(500)
  }
})
  
todolist.put('/users/:email/todolists/:todolist_id', checkIfUserOwnsList,  async (req, res) =>{
  const Op = Sequelize.Op
  let nonNumbericCharsRegex = /\D/
  let todoList = req.body
  let createListAsNew = nonNumbericCharsRegex.test(todoList.id)
  // if there is an id but it's not in the db id-column format, then leave it blank so bulk create creates a new item
  // if no user is assiged to the list, assign current user as the owner
  todoList.id = createListAsNew ? '' : todoList.id
  todoList.user_id = !todoList.user_id ? req.authenticatedUser.id : todoList.user_id
  
  try{
    let dbList = await TodoList.bulkCreate([todoList],{updateOnDuplicate:['name']})
    dbList = dbList.length ? dbList[0] : null
    if(!dbList) return res.sendStatus(400)

    let todoItems = todoList.todoitems
    let todoItemsStillInUpdatedList = []

    // All todoitems must have an id and must belong to current list
    // If id is invalid or list is a new list, todo-items ids are set to empty to be created again
    todoItems.forEach(item=>{
      todoItemsStillInUpdatedList.push(item.id)
      if(nonNumbericCharsRegex.test(item.id) || createListAsNew)
        item.id = ''
      item.todolist_id = dbList.id
    })

    let destroyItemsThatNoLongerBelongToList = await TodoItem.destroy({
      where: {
        todolist_id:dbList.id, 
        id: {
          [Op.notIn]: todoItemsStillInUpdatedList
        }
    }})

    let todos = await TodoItem.bulkCreate(todoItems,{updateOnDuplicate:['content', 'completed']})
    dbList.todoitems = todos
    res.json({owned: dbList})

  }catch(e){
    console.error(e)
  } 
})
'/todolists/:todolist_id/:userid'
todolist.delete('/users/:email/todolists/:todolist_id', checkIfUserOwnsList, getEmailOwnerInfo, async (req, res)=>{
  let todolist_id = req.params.todolist_id
  if(!todolist_id) return res.sendStatus(400)
  try{
    if(req.userOwnsList && (req.authenticatedUser.id == req.emailOwner.id)){
      let deletedList = await TodoList.destroy({where:{id: todolist_id}})
      if(deletedList == 0) return res.sendStatus(404)
    }else if(req.userOwnsList){
      let deletedList = await TodoListUser.destroy({where:{todolist_id, user_id: req.emailOwner.id}})
      if(deletedList == 0) return res.sendStatus(404)
    }else if(req.userIsSharedList){
      let deletedList = await TodoListUser.destroy({where:{todolist_id, user_id: req.authenticatedUser.id}})
      if(deletedList == 0) return res.sendStatus(404)
    }else
      return res.sendStatus(404)
    return res.sendStatus(200)
  }catch(e){
    console.error(e)
  }
  res.sendStatus(200)
  
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
  
todolist.post('/users/:username/todolists', getUserInfo , async (req, res)=>{
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
  let todolist_id = req.params.todolist_id
  try{
    if(/\D/.test(todolist_id)) return res.sendStatus(400)
    let todolistuser = await TodoListUser.findAll( {where:{todolist_id}, include: User})
    res.json({todolistuser})
  }catch(e){
    console.log(e)
    return res.sendStatus(500)
  }
})
  
// todolist.delete('/todolists/:todolist_id/shared/:email', checkIfUserOwnsList , async (req, res)=>{
//   try{
//     let {todolist_id, email } = req.params
//     let user = await User.findOne({where:{email}})
//     if(!user) return res.sendStatus(404)
//     let deleteResult = await TodoListUser.destroy({where:{user_id:user.id, todolist_id}})
//     if(!deleteResult) res.sendStatus(404)
//     res.sendStatus(200)
    
//   }catch(e){
//     console.error(e)
//     return res.sendStatus(500)
//   }
// })
  
todolist.post('/todolists/:todolist_id/shared/', checkIfUserOwnsList , async (req, res)=>{
  let {todolist_id} = req.params
  let email = req.body.email
  if(email === req.authenticatedUser.id) return res.sendStatus(409)

  try{
    let user = await User.findOne({where:{email}})
    if(!user) return res.sendStatus(404)
    let newSharedList = await TodoListUser.create({todolist_id, user_id:user.id})
    let todolistuser = await TodoListUser.findOne( {where:{todolist_id: newSharedList.todolist_id, user_id: newSharedList.user_id}, include: User})
    res.json({todolistuser})
  }catch(e){
    if(e.name=='SequelizeUniqueConstraintError')
      return res.sendStatus(409)
    console.error(e)
    return res.sendStatus(500)
  }
})
  
module.exports = todolist