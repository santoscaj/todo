const router = require('./index.js')

function getTodoListId(req, res, next){
    let todolist_id = req.params.todolist_id
    if(!todolist_id) return res.sendStatus(400)
    req.todolist_id = todolist_id
    next()
}

function checkIfUserOwnsList(req, res, next){
  // list would return {user_id: id, shared_users: [{user_id: id}, {user_id: id}]}
  let lists = await TodoList.findAll({ attributes:["user_id", "shared_users.user_id"],where:{id:req.params.todolist_id},include: [{required:false, model: TodoListUser, as: 'shared_users'}]})
  let userOwnsList = lists.some(list=>list.user_id==req.user.id)
  let userIsSharedList = lists.some(list.shared_users.some(shared_user=>shared_user.user_id ==req.user.id))
  req = {...req, userOwnsList, userIsSharedList}
  if(userOwnsList || userIsSharedList) 
    next()
  console.log(`user with id ${req.user.id} cannot modify list id ${req.params.todolist_id}`)
  return res.sendStatus(404)
}

router.get('/users/:username/todolists', getUserInfo , async (req, res)=>{
    console.log('request started')
    try{
      let ownedTodos = await TodoList.findAll({where:{user_id: req.user.id}, include: TodoItem })
      let sharedTodos = await TodoList.findAll({include: [{model: User, as: 'users', attributes: ['id'],where:{id:req.user.id}}, TodoItem]})
      if(!ownedTodos && !sharedTodos) res.sendStatus(404)
      res.json({shared: sharedTodos, owned: ownedTodos})
    }catch(e){
      console.error(e)
      return res.sendStatus(500)
    }
  })
  
  router.delete('/users/:username/todolists/:todolist_id', getUserInfo , async (req, res)=>{
    try{
      let todolist_id = req.params.todolist
      if(!todolist_id) return res.sendStatus(400)
      let deletedList = await TodoList.destroy({where:{id: todolist_id, user_id: req.user.id}})
      if(!deletedList) return res.sendStatus(404)
      res.sendStatus(200)
    }catch(e){
      console.error(e)
      return res.sendStatus(500)
    }
  })
  
  router.post('/users/:username/todolists/', getUserInfo , async (req, res)=>{
    try{
        let todolist = req.body
        let createdList = await TodoList.create(todolist, {include: [{model: TodoItem, as: 'todoitems'}, {model: TodoListUser, as: 'shared_users'}]})
        return res.json(createdList)
    }catch(e){
        console.error(e)
        return res.sendStatus(500)
    }
  })
  

  router.get('/todolists/:todolist_id/shared', checkIfUserOwnsList , async (req, res)=>{
    try{
      let users = await TodoListUser.findAll({where:{todolist_id: req.todolist_id}})
      res.json(users)
    }catch(e){
      console.error(e)
      return res.sendStatus(500)
    }
  })
  
  router.delete('/todolists/:todolist_id/shared/:email', checkIfUserOwnsList , async (req, res)=>{
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
  22
  router.post('/todolists/:todolist_id/shared/', checkIfUserOwnsList , async (req, res)=>{
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
  
