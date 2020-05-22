require('dotenv').config()
const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
const { users} = require('./utils/Default')
const isEmail = require('validator/lib/isEmail')


const myLoggingFunction = function(message){
  let cyanColor = '\x1b[36m%s\x1b[0m'
  if(process.env.LOG_DB==='true'){
    console.log('--------------------------------------------------------')
    console.log(cyanColor,message)
  }
}

const sequelize = new Sequelize('todos_db','postgres','admin',{
    host: 'localhost',
    dialect: 'postgres',
    logging: myLoggingFunction
})

async function addDefaultUsers(){
  printedAlready = false
  for(let user of users){
    try {
      let usr = await User.findOrCreate({where:{...(user.userData) }})
      for (let todo of user.todoLists){
        let list = await TodoList.findOrCreate({where:{name: todo.name, user_id: usr[0].dataValues.id}})
        for(let todoitem of todo.todoItems){
          await TodoItem.findOrCreate({where:{...todoitem, todolist_id: list[0].dataValues.id}})
        }
      }
    }catch(err){
      if(err.message=='Validation error' && !printedAlready){
        console.log('One or more default users have been modified')
        printedAlready =true
      }else if(err.message!='Validation error')
        console.error(err.message)
    }
  }
}

sequelize
  .authenticate()
  .then(() => {
    if(process.env.LOG_DB==='false')
      console.log("To see DB queries change environmental variable LOG_DB to 'true'");
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate:{
      isEmail : true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  account_is_active: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  is_admin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  image_link:{
    type: Sequelize.STRING
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
}, {
  // options
  hooks:{
    beforeDestroy: async function(instance, options){
      return Error('beforeDestroy this is my error. Method not used and not defined');
      let adminUsers = await this.findAll({where:{is_admin:true}})
      if(!adminUsers.dataValues) throw new Error('There are no admin users')
      if(adminUsers.dataValues.length==1)  throw new Error('cannot delete last admin user')
    },
    beforeBulkDestroy: async function(instance, options){
      let where = instance.where
      let queryUsersTobeDestroyed = await this.findAll({where})
      let queryAdminUsers = await this.findAll({where: {is_admin: true}})
      let adminUsersToBeDestroyed = queryUsersTobeDestroyed.map(u => u.dataValues).filter(u => u.is_admin)
      let totalAdminUsers = queryAdminUsers.map(u => u.dataValues).filter(u => u.is_admin)
      if(totalAdminUsers.length == adminUsersToBeDestroyed.length){
        if(totalAdminUsers.length==1)
          throw new Error('Cannot delete only admin user')
        else
          throw new Error('Cannot delete all admin users')
      }
    },
    beforeUpdate: async function(instance, options){
      let adminUsers = await this.findAll({where:{is_admin:true}})
      return Error('beforeUpdate this is my error. Method not used and not defined');
      if(!adminUsers.dataValues) throw new Error('There are no admin users')
      if(adminUsers.dataValues.length==1)  throw new Error('cannot delete last admin user')
    },
    // beforeBulkUpdate takes an instance that has an array of fields to be updated (fields) and their update values (attributes)
    // This will only take effect if the field to be modified is admin and they are trying to remove the only admin left
    beforeBulkUpdate: async function(instance){
      let where = instance.attributes
      if(instance.fields.includes('is_admin') && where && !where.is_admin){
        let queryAdminUsers = await this.findAll({where: {is_admin: true}})
        let totalAdminUsers = queryAdminUsers.map(u => u.dataValues).filter(u => u.is_admin)
        if(totalAdminUsers.length==1)
          throw new Error('Cannot remove only admin user')
      }
    }
  }
});

const TodoList = sequelize.define('todolist', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false, 
    references:{
      model: User,
      key: 'id'
    }
  },
}, {
  // options
});

User.hasMany(TodoList, {foreignKey: 'user_id', constraints: false})
TodoList.belongsTo(User, {foreignKey: 'id', constraints: false})

const TodoItem = sequelize.define('todoitem', {
  content: {
    type: Sequelize.STRING,
    allowNull: false
  },
  completion: Sequelize.BOOLEAN,
  todolist_id: {
    type: Sequelize.INTEGER,
    allowNull: false, 
    references:{
      model: TodoList,
      key: 'id'
    }
  },
}, {
  // options
});

TodoList.hasMany(TodoItem, {foreignKey: 'todolist_id', constraints: false})
TodoItem.belongsTo(TodoList, {foreignKey: 'id', constraints: false})

const TodoListUser = sequelize.define('todolist_user', {
  user_id: {
    type:Sequelize.INTEGER,
    allowNull: false, 
    references:{
      model: User, 
      key: 'id'
    }
  },
  todolist_id: {
    type: Sequelize.INTEGER,
    allowNull: false, 
    references:{
      model: TodoList, 
      key: 'id'
    }
  }
}, {
  // options
});

TodoList.belongsToMany(User, {through: TodoListUser, as: 'users', foreignKey: 'todolist_id' })
User.belongsToMany(TodoList, {through: TodoListUser, as: 'publicTodoLists', foreignKey: 'user_id'})

sequelize.sync()

module.exports = { User, TodoList, TodoItem, TodoListUser, Sequelize, sequelize }

addDefaultUsers()





// testing functions - can be removed
// ;((async function(){
//   try{ 
//     let newUser =  await User.create({
//       id: "99",
//       username: "testo",
//       password: "1234",
//       email: "12313213",
//       is_admin: false,
//       firstName: "",
//       lastName: "",
//       image_link: ""
//       })
//     console.log('created user with no error')
//     console.log(newUser)
//   }catch(e){
//     if(e.message = 'Validation error: Validation isEmail on email failed')
//       console.log('you got what you wnated')
//     else 
//       console.log(e.message)
//   }
// })())

// ;((async function(){
//   try{ 
//     let destroyedUser = User.destroy({where:{username:'admin'}})
//   }catch(e){
//     // if(e.message == 'cannot bulk delete all admin users')
//     //   console.log('You got what you wnated')
//     // else 
//       console.dir(e)
//   }
// })())


