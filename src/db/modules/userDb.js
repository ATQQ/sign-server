const User = require('../obj/user')
const { findCollection, insertCollection } = require('./public')

function findUser(user) {
  return findCollection('user', user)
}

function insertUser(userId, options = {}) {
  return insertCollection('user', new User(userId, options))
}
module.exports = {
  findUser,
  insertUser,
}
