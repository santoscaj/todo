const express = require('express')
const SQ = require('./sq')
const app = express()
 
app.get('/', function (req, res) {
  res.send('Hello Berto')
})
 
app.listen(3000)