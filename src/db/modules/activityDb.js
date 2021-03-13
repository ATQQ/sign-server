const { getUniqueId } = require('../../utils/stringUtil')
const { findCollection, insertCollection, updateCollection } = require('./public')

function insertActivity(options) {
  const activityId = getUniqueId()
  const pwd = activityId.slice(-6)
  const defaultOptions = {
    activityId,
    nameFormat: '',
    peopleCount: 0,
    pwd,
  }
  return findCollection('activity', { pwd }).then((data) => {
    if (data.length !== 0) {
      return insertActivity(options)
    }

    return insertCollection('activity', Object.assign(defaultOptions, options))
  })
}

function findManageActivities(userId) {
  return findCollection('activity', {
    userId,
  })
}

function updateActivityInfo(activityId, userId, info) {
  return updateCollection('activity', {
    activityId,
    userId,
  }, {
    $set: info,
  })
}

function findActivity(query) {
  return findCollection('activity', query)
}
module.exports = {
  insertActivity,
  findManageActivities,
  updateActivityInfo,
  findActivity,
}
