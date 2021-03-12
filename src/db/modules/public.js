const { query: mongodbQuery } = require('../mongodb')

function updateCollection(collection, query, data) {
  return mongodbQuery((db, resolve) => {
    db.collection(collection).update(query, data).then(resolve)
  })
}
module.exports = {
  updateCollection,
}
