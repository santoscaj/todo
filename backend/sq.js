const Sequelize = require('sequelize')
const { users} = require('./utils/Default')
const sequelize = new Sequelize('todos_db','postgres','admin',{
    host: 'localhost',
    dialect: 'postgres'
})

async function addDefaultUsers(){
  for(let user of users){
    try {
      let usr = await User.findOrCreate({where:{...(user.userData) }})
      for (let todo of user.todoList){
        await Todo.findOrCreate({where:{...todo, user_id: usr[0].dataValues.id}})
      }
    }catch(e){
      console.error(e)
    }

  }
}

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  is_admin: {
    type: Sequelize.BOOLEAN,
    allowNull: false
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

module.exports = { User, Todo }