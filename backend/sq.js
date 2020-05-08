require('dotenv').config()
const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
const { users} = require('./utils/Default')


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
    unique: true
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

addDefaultUsers()

module.exports = { User, Todo, Sequelize }