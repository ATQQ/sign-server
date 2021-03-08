const { query: mongodbQuery } = require('../mongodb')

function findUser() {
  return mongodbQuery((db, resolve) => {
    db.collection('user').find().toArray().then(resolve)
  })
}

module.exports = {
  findUser,
}
