const router = require('express').Router()

const { StatusCode } = require('../../constants')
const {
  insertActivity, findManageActivities, updateActivityInfo, findActivityByIds, findActivity,
} = require('../../db/modules/activityDb')
const { findPeopleByUserId, findActivityPeople } = require('../../db/modules/peopleDb')
const { findRecordBySignId, findRecordByActivityIdAndUserId } = require('../../db/modules/recordDb')
const { findSignByActivityId } = require('../../db/modules/signDb')
const Result = require('../../utils/result')
const { getLoginUserInfo } = require('../../utils/userUtil')

/**
 * 创建活动
 */
router.post('/create', (req, res) => {
  const userInfo = getLoginUserInfo(req)
  const {
    name, description, format = '', count = 0,
  } = req.body
  const { userId } = userInfo
  insertActivity({
    name,
    description,
    nameFormat: format,
    peopleCount: count,
    userId,
  }).then(() => {
    res.send(Result.success())
  })
})

/**
 * 获取管理的活动列表
 */
router.get('/list', (req, res) => {
  const userInfo = getLoginUserInfo(req)
  const { userId } = userInfo
  findManageActivities(userId).then((data) => {
    res.send(Result.success({
      activities: data,
    }))
  })
})

/**
 * 更新活动信息
 */
router.put('/info/:id', (req, res) => {
  const { id } = req.params
  const { userId } = getLoginUserInfo(req)

  const newInfo = req.body
  updateActivityInfo(id, userId, newInfo).then(() => {
    res.send(Result.success())
  })
})

/**
 * 获取参与的活动列表
 */
router.get('/list/join', (req, res) => {
  const { userId } = getLoginUserInfo(req)
  findPeopleByUserId(userId).then((data) => {
    if (data.length === 0) {
      res.send(Result.success({
        activities: [],
      }))
      return
    }
    findActivityByIds(data.map((d) => d.activityId))
      .then((activities) => {
        // 屏蔽掉无关字段
        activities.forEach((a) => {
          a.peopleCount = undefined
          a.userId = undefined
        })
        res.send(Result.success({
          activities,
        }))
      })
  })
})

/**
 * 获取活动总体签到情况
 */
router.get('/analyze/:id', async (req, res) => {
  const { id: activityId } = req.params
  const { userId } = getLoginUserInfo(req)
  const [activity] = await findActivity({ activityId, userId })
  // 当前用户无此活动权限
  if (!activity) {
    res.send(Result.fail(StatusCode.nowPower))
    return
  }
  const people = await findActivityPeople(activityId)
  const sign = await findSignByActivityId(activityId)
  // eslint-disable-next-line no-restricted-syntax
  for (const s of sign) {
    // eslint-disable-next-line no-await-in-loop
    const records = await findRecordBySignId(s.signId)
    s.records = records
  }
  res.send(Result.success({
    people,
    sign,
  }))
})

/**
 * 个人获取在活动中的签到记录
 */
router.get('/sign/:id', async (req, res) => {
  const { userId } = getLoginUserInfo(req)
  const { id: activityId } = req.params
  findRecordByActivityIdAndUserId(activityId, userId).then((records) => {
    res.send(Result.success({
      records,
    }))
  })
})

router.get('/info/:pwd', (req, res) => {
  const { pwd } = req.params
  findActivity({
    pwd,
  }).then((data) => {
    const [activity] = data
    if (activity) {
      res.send(Result.success(activity))
      return
    }
    res.send(Result.fail(StatusCode.people.notExist, 'not exist'))
  })
})
module.exports = {
  prefix: '/activity',
  router,
}
