const redis = require('redis')

const { redisConfig } = require('../config')

const { port, host, password } = redisConfig

module.exports = function getClient(callback) {
  return new Promise((res, rej) => {
    const client = redis.createClient(port, host, {
      password,
    })
    callback(client)
    client.on('error', (err) => {
      console.log(`Error ${err}`)
      rej(err)
    })
  })
}
