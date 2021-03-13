const { getUniqueId } = require('../../utils/stringUtil')
const { findCollection, insertCollection, updateCollection } = require('./public')

function insertSign(options) {
  const signId = getUniqueId()
  const pwd = signId.slice(-6)
  const defaultOptions = {
    signId,
    qrcode: getUniqueId(),
    location: '',
    pwd,
  }
  return findCollection('sign', { pwd }).then((data) => {
    if (data.length !== 0) {
      return insertSign(options)
    }

    return insertCollection('sign', Object.assign(defaultOptions, options))
  })
}

function findSignByStatus(status) {
  return findCollection('sign', {
    status,
  })
}
module.exports = {
  insertSign,
  findSignByStatus,
}
