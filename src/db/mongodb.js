const { MongoClient } = require('mongodb')
const { mongodbConfig } = require('../config')

const {
  host, port, user, password, database,
} = mongodbConfig
const url = `mongodb://${user}:${password}@${host}:${port}/${database}`

function getDBConnection() {
  return new Promise((res, rej) => {
    if (getDBConnection.instance) {
      res(getDBConnection.instance)
      return
    }
    MongoClient.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }).then((db) => {
      getDBConnection.instance = {
        db,
        Db: db.db(database),
      }
      res({
        db,
        Db: db.db(database),
      })
      db.on('error', (error) => {
        console.log(`MongoDB connecting failed: ${error}`)
        getDBConnection.instance = null
      })
    }).catch((err) => {
      rej(err)
    })
  })
}

function query(callback) {
  const p = new Promise((resolve, rej) => {
    getDBConnection().then(({ db, Db }) => {
      // 执行回调
      callback(Db, resolve)
      // resolve后关闭
      p.catch((e) => rej(e))
        .finally(() => {
          // db.close()
        })
    })
  })
  return p
}

module.exports = {
  getDBConnection,
  query,
}
