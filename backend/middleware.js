const { User, TodoList, TodoListUser} = require('./sq')

async function getUserInfo(req, res, next){    
    let username = req.params.username
    if(!username) return res.sendStatus(400)
    
    try{
      let userData = await User.findOne({where:{username}})
      if(!userData) return res.sendStatus(404)    // Couldnt veirify page
  
      let authenticatedUser = req.authenticatedUser
      if(userData.id != authenticatedUser.id && !authenticatedUser.is_admin) return sendStatus(403)
  
      req.pageOwner = userData
      next()
    }catch(e){
      console.error(e)
      return res.sendStatus(500)
    }
}


async function getEmailOwnerInfo(req, res, next){    
  let email = req.params.email
  if(!email) return res.sendStatus(400)
  
  try{
    let userData = await User.findOne({where:{email}})
    if(!userData) return res.sendStatus(404)    // Couldnt veirify page

    req.emailOwner = userData
    next()
  }catch(e){
    console.error(e)
    return res.sendStatus(500)
  }
}

async function checkIfUserOwnsList(req, res, next){
    let newListRegex = /\D/

    if(newListRegex.test(req.params.todolist_id)){
      req.userOwnsList = true
      req.userIsSharedList = false
      next()
    }else{
      let lists = await TodoList.findAll({ 
        // attributes: ["user_id", "shared_users.user_id"],
        where: { 
          id:req.params.todolist_id
        },
        include: {
          required:false, 
          model: TodoListUser, 
          as: 'shared_users'
        }
      })
  
      if(lists.lentgth==0)
        next()
      else{
        let userOwnsList = lists.some(list=>list.user_id==req.authenticatedUser.id)
        let userIsSharedList = lists.some(list=>list.shared_users.some(shared_user=>shared_user.user_id == req.authenticatedUser.id))
  
        req.userIsSharedList = userIsSharedList
        req.userOwnsList = userOwnsList
        if(!userOwnsList && !userIsSharedList) {
          console.error(`user with id ${req.authenticatedUser.id} cannot modify list id ${req.params.todolist_id}`)
          return res.sendStatus(404)
        }
        else{
          next()
        }
      }
    }
  }
  
/*
Takes an object and an array of the desired fields from that object.
If object has a child object we can send an array of the child's desired fields in a object with the childs name

object = {a: "a", b:"b", a1: {y:"y",z:"z"}}
desired = ['a',{a1:['y']}]

output = {a:"a", a1:{y:"y"}}
*/

const user = ['id','username', 'email','is_admin', 'firstName','lastName', 'image_link', 'account_is_active']
const todolist = ['id','name','user_id']
const todoitem = ['id','content','completed','todolist_id']

const allDesiredFields = {
	user,
	todolist,
	todoitem,
	shared: [...todolist,{todoitems:[...todoitem]}],
  owned:  [...todolist,{todoitems:[...todoitem]}],
  todolistuser : ['user_id', 'id']
}

function cleanObject(dataObject,field){
	if(field in allDesiredFields){
		let desiredFields = allDesiredFields[field]
		return cleanDataObject(dataObject,desiredFields)
	}else 
		return dataObject
}

function cleanDataObject(dataObject, desiredFields){
	
	if (!dataObject)
		return

	if(!desiredFields)
		throw new Error('desired fields not included')
	
	let isArray = Array.isArray(dataObject)
	let cleanObject = isArray? [] : {}
	
	if(isArray)
		dataObject.forEach(item=>cleanObject.push(cleanDataObject(item, desiredFields)))
	else{
        for(let field of desiredFields){		
            // string values are to be copied exactly from the object if exists in object
			if(typeof field === 'string' || typeof field === 'boolean'){
				if(dataObject[field])
                    cleanObject[field] = dataObject[field]
			}     
            // objects indicate that there is a child that needs to be cleaned
			else
				for(let child of Object.keys(field))
					cleanObject[child] = cleanDataObject(dataObject[child],field[child])
		}				
	}
	return cleanObject
}
  
module.exports = { getUserInfo, checkIfUserOwnsList, cleanObject, getEmailOwnerInfo, cleanDataObject}