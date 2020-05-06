let activeUserTokens = []

function addToken(token, username){
  if(!token || !username)
    throw new Error('Token or username not specified')
  activeUserTokens.push({token, username})
}

function getUser(token){
    if(!token)
        throw new Error('No token provided in function')
    return activeUserTokens.filter(item => item.token===token)[0].username
}

function removeToken(token){
  let index = activeUserTokens.findIndex(item=>(item.token===token))
  if(index < 0)
    return false
  activeUserTokens.splice(index, 1)
  return true
}

module.exports = {addToken, getUser, removeToken}