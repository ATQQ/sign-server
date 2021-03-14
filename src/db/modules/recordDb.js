const { getUniqueId } = require('../../utils/stringUtil')
const { findCollection, insertCollection, updateCollection } = require('./public')

function insertRecord(options) {
  const recordId = getUniqueId()
  const defaultOptions = {
    recordId,
    lastTime: new Date(),
    location: '',
    photo: '',
    tips: '',
    rank: 0,
  }
  return insertCollection('record', Object.assign(defaultOptions, options))
}

function findRecordByUserIdAndSignId(userId, signId) {
  return findCollection('record', {
    userId,
    signId,
  })
}

function updateRecord(query, data) {
  return updateCollection('record', query, {
    $set: data,
  })
}

module.exports = {
  findRecordByUserIdAndSignId,
  updateRecord,
  insertRecord,
}
