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
  setTimeout(() => {
    // 异步更新签到名次
    updateRecordRank(recordId, options.signId)
  }, 1000)
  return insertCollection('record', Object.assign(defaultOptions, options))
}

function findRecordByUserIdAndSignId(userId, signId) {
  return findCollection('record', {
    userId,
    signId,
  })
}

function findRecordByPeopleIdAndSignId(peopleId, signId) {
  return findCollection('record', {
    peopleId,
    signId,
  })
}

function findRecordByActivityIdAndUserId(activityId, userId) {
  return findCollection('record', {
    activityId,
    userId,
  })
}
function findRecordBySignId(signId) {
  return findCollection('record', {
    signId,
  })
}
function updateRecord(query, data) {
  return updateCollection('record', query, {
    $set: data,
  })
}

function updateRecordRank(recordId, signId) {
  findRecordBySignId(signId).then((records) => {
    if (records.length === 0) {
      updateRecord({
        recordId,
      }, {
        rank: 1,
      })
      return
    }
    const idx = records.findIndex((record) => record.recordId === recordId)
    updateRecord({
      recordId,
    }, {
      rank: idx + 1,
    })
  })
}

module.exports = {
  findRecordByUserIdAndSignId,
  updateRecord,
  insertRecord,
  findRecordByPeopleIdAndSignId,
  updateRecordRank,
  findRecordBySignId,
  findRecordByActivityIdAndUserId,
}
