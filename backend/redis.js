let { createClient } = require('redis');

let expirationInMins = 30
let expirationInSecs = expirationInMins *60

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

client.connect()

async function setKey(key, value){
  await client.set(key,value ,{
    EX: expirationInSecs
  });
}

async function getValue(key){
  return await client.get(key);
}

module.exports = {setKey, getValue, expirationInMins}