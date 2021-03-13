const { getUniqueId } = require('../../utils/stringUtil')
const { findCollection, insertCollection } = require('./public')

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

module.exports = {
  insertActivity,
}
