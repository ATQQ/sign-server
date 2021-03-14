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

function findSignById(signId) {
  return findCollection('sign', {
    signId,
  })
}

function findSignByActivityId(activityId) {
  return findCollection('sign', {
    activityId,
  })
}

function updateSign(query, data) {
  return updateCollection('sign', query, {
    $set: data,
  })
}

function findSignByQcCode(qrcode) {
  return findCollection('sign', {
    qrcode,
  })
}

function findSignByPwd(pwd) {
  return findCollection('sign', {
    pwd,
  })
}
module.exports = {
  insertSign,
  findSignByStatus,
  findSignById,
  updateSign,
  findSignByActivityId,
  findSignByQcCode,
  findSignByPwd,
}
