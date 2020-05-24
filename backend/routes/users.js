
const router = require('./index.js')


router.get('/users', async (req, res)=>{
  try{
    let authenticatedUser = req.authenticatedUser
    if(!authenticatedUser.is_admin) return res.sendStatus(404)

    let queryResults = await User.findAll({include:Todo})
    res.json(allUsers)
  }catch(e){
    if(e.message == 'invalid token') return res.status(400).send(e.message)
    console.error(e)
  }
})

router.get('/users/:username', getUserInfo, async(req, res)=>{
  let {authenticatedUser, user} = req
  try{
    if(authenticatedUser.username !== user.username) return res.sendStatus(404)
    res.json(authenticatedUser)

  }catch(e){
    if(e.message == 'invalid token') return res.status(400).send(e.message)
    res.sendStatus(500)
    console.error(e)
  }
})

router.delete('/users/:username', getUserInfo, async (req, res)=>{
  let {user} = req

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

router.put('/users/:username', getUserInfo,async (req, res)=>{
  let {user, authenticatedUser} = req
  let data = req.body
  if( !data) return res.sendStatus(400)

  try{
    await User.update(data, {where:{username:user.username}})
    let newUpdatedUser = await User.findOne({where:{id:user.id}})
    res.json(newUpdatedUser)
    
  }catch(e){
    console.error(e)
    if(/admin user/.test(e.message))
      return res.status(400).send(e.message)
    return res.sendStatus(500)
  }
})

module.exports = router
