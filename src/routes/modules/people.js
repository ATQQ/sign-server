const router = require('express').Router()

const { StatusCode } = require('../../constants')
const { findActivity } = require('../../db/modules/activityDb')
const {
  insertPeople, findPeople, findActivityPeople, updatePeopleName,
} = require('../../db/modules/peopleDb')
const Result = require('../../utils/result')
const { getLoginUserInfo } = require('../../utils/userUtil')

/**
 * 成员加入活动
 */
router.post('/join', (req, res) => {
  const { name, pwd } = req.body
  const { userId } = getLoginUserInfo(req)
  findActivity({
    pwd,
  }).then(async (data) => {
    const [activity] = data
    if (!activity) {
      res.send(Result.fail(StatusCode.people.notExist, 'activity is not exist'))
      return
    }
    const { activityId } = activity
    const [people] = await findPeople(userId, activityId)

    if (people) {
      res.send(Result.fail(StatusCode.people.exist, 'already exist'))
      return
    }

    insertPeople({
      activityId: activity.activityId,
      userId,
      name,
    }).then(() => {
      res.send(Result.success())
    })
  })
})

/**
 * 获取活动成员信息
 */
router.get('/:id', (req, res) => {
  const { id } = req.params
  const { userId } = getLoginUserInfo(req)
  findActivity({
    activityId: id,
    userId,
  }).then((data) => {
    const [activity] = data
    if (!activity) {
      res.send(Result.success({
        people: [],
      }))
      return
    }
    findActivityPeople(id).then((people) => {
      res.send(Result.success({
        people,
      }))
    })
  })
})

/**
 * 修改活动成员的姓名
 */
router.put('/:id', (req, res) => {
  const { id } = req.params
  const { name, activityId } = req.body
  const { userId } = getLoginUserInfo(req)
  findActivity({
    activityId,
    userId,
  }).then((data) => {
    const [activity] = data
    if (!activity) {
      res.send(Result.fail(StatusCode.nowPower, 'no power'))
      return
    }
    updatePeopleName(id, activityId, name).then(() => {
      res.send(Result.success())
    })
  })
})
module.exports = {
  prefix: '/people',
  router,
}
