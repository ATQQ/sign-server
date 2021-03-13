const { getUniqueId } = require('../../utils/stringUtil')
const { findCollection, insertCollection, updateCollection } = require('./public')

function insertPeople(options) {
  const defaultOptions = {
    peopleId: getUniqueId(),
    joinTime: new Date(),
  }
  return insertCollection('people', Object.assign(defaultOptions, options))
}

function findPeople(userId, activityId) {
  return findCollection('people', {
    userId,
    activityId,
  })
}

function findActivityPeople(activityId) {
  return findCollection('people', {
    activityId,
  })
}

function updatePeopleName(peopleId, activityId, newName) {
  return updateCollection('people', {
    peopleId,
    activityId,
  }, {
    $set: {
      name: newName,
    },
  })
}
module.exports = {
  insertPeople,
  findPeople,
  findActivityPeople,
  updatePeopleName,
}
