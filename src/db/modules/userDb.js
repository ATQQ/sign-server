const { query: mongodbQuery } = require('../mongodb')
const User = require('../obj/user')

function findUser(user) {
  return mongodbQuery((db, resolve) => {
    db.collection('user').find(user).toArray().then(resolve)
  })
}

function insertUser(userId, gender = 1, nickname = '随机') {
  return mongodbQuery((db, resolve) => {
    db.collection('user').insert(new User(userId, { gender, nickname })).then(resolve)
  })
}
module.exports = {
  findUser,
  insertUser,
}
