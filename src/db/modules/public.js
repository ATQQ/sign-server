const { query: mongodbQuery } = require('../mongodb')

function updateCollection(collection, query, data) {
  return mongodbQuery((db, resolve) => {
    db.collection(collection).update(query, data).then(resolve)
  })
}

function insertCollection(collection, data) {
  return mongodbQuery((db, resolve) => {
    db.collection(collection).insertOne(data).then(resolve)
  })
}
function findCollection(collection, query) {
  return mongodbQuery((db, resolve) => {
    db.collection(collection).find(query).toArray().then(resolve)
  })
}
module.exports = {
  updateCollection,
  insertCollection,
  findCollection,
}
