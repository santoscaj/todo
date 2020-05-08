require('dotenv').config()
const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
const { users} = require('./utils/Default')
const isEmail = require('validator/lib/isEmail')


const myLoggingFunction = function(message){
  if(process.env.LOG_DB==='true')
    console.log(message)
}

const sequelize = new Sequelize('todos_db','postgres','admin',{
    host: 'localhost',
    dialect: 'postgres',
    logging: myLoggingFunction
})

async function addDefaultUsers(){
  for(let user of users){
    try {
      let usr = await User.findOrCreate({where:{...(user.userData) }})
      for (let todo of user.todoList){
        await Todo.findOrCreate({where:{...todo, user_id: usr[0].dataValues.id}})
      }
    }catch(err){
      console.error(err.message)
    }
  }
}

// class MyError extends Error {
//   constructor(message) {
//     super(message); // (1)
//     // this.name = "ValidationError"; // (2)
//   }
// }

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
      return Error('beforeDestroy this is my error');
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
      if(totalAdminUsers.length == adminUsersToBeDestroyed.length)
        throw new Error('cannot bulk delete all admin users')
    }
  }
});

const Todo = sequelize.define('todos', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false
  },
  user_id: {
    type: Sequelize.INTEGER,
    references:{
      model: User,
      key: 'id'
    }
  },
}, {
  // options
});

User.hasMany(Todo, {foreignKey: 'user_id', constraints: false})
Todo.hasOne(User, {foreignKey: 'id', constraints: false})

sequelize.sync()

module.exports = { User, Todo, Sequelize }

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


