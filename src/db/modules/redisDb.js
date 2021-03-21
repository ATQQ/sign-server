const { Time } = require('../../constants')
const getClient = require('../redis')

function setKV(k, v, timeout = Time.HOUR * 2) {
  let str = v
  if (v instanceof Object) {
    str = JSON.stringify(v)
  }
  getClient((client) => {
    client.set(k, str, () => {
      client.expire(k, timeout, () => {
        client.quit()
      })
    })
  })
}

function getV(key) {
  return new Promise((res) => {
    getClient((client) => {
      client.get(key, (err, data) => {
        try {
          res(JSON.parse(data))
        } catch (error) {
          res(data)
        } finally {
          client.quit()
        }
      })
    })
  })
}

module.exports = {
  setKV,
  getV,
}
