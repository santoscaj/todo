const router = require('./index.js')

router.put('/todoitems/:todoitem_id', async (req, res)=>{
    try{
        let todoitem_id = req.params.todoitem_id
        let newData = req.body
        let updatedItem = TodoItem.udpate(newData,{where:{id: todoitem_id,user_id:req.pageOwner.id}})      
        if(!updatedItem) return res.sendStatus(404)
        res.json({todoItem:updatedItem})
    }catch(e){
      console.error(e)
      return res.sendStatus(500)
    }
  })
  
  router.delete('/todoitems/:todoitem_id', async (req, res)=>{
    try{
        let todoitem_id = req.params.todoitem_id
        let todoItemList = await TodoList.findOne({where:{user_id: req.pageOwner.id},include: {model:TodoItem, where:{id:todoitem_id}}})
        if(!todoItemList) return res.sendStatus(404)
        await TodoItem.destroy({where:{id: todoitem_id}})
        res.sendStatus(200)
    }catch(e){
      console.error(e)
      return res.sendStatus(500)
    }
  })
  
  router.post('/todoitems/:todoitem_id', async (req, res)=>{
    let todolist = req.body
    try{
      return res.json({todoList: createdList})
    }catch(e){
      console.error(e)
      return res.sendStatus(500)
    }
  })
  

  