const { query: mongodbQuery } = require('../mongodb')
const User = require('../obj/user')

function findUser(user) {
  return mongodbQuery((db, resolve) => {
    db.collection('user').find(user).toArray().then(resolve)
  })
}

function insertUser(userId, options = {}) {
  return mongodbQuery((db, resolve) => {
    db.collection('user').insert(new User(userId, options)).then(resolve)
  })
}
module.exports = {
  findUser,
  insertUser,
}
