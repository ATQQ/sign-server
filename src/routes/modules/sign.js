const router = require('express').Router()

const { StatusCode, SignStatus } = require('../../constants')
const {
  insertActivity, findManageActivities, updateActivityInfo, findActivityByIds, findActivity,
} = require('../../db/modules/activityDb')
const { findPeopleByUserId } = require('../../db/modules/peopleDb')
const { insertSign } = require('../../db/modules/signDb')
const Result = require('../../utils/result')
const { getLoginUserInfo } = require('../../utils/userUtil')

/**
 * 创建签到
 */
router.post('/:id', (req, res) => {
  const { id: activityId } = req.params
  const { method, location, time } = req.body
  const { userId } = getLoginUserInfo(req)
  // 校验权限
  findActivity({
    activityId,
  }).then((data) => {
    const [activity] = data
    if (!activity || activity.userId !== userId) {
      res.send(Result.fail(StatusCode.nowPower))
      return
    }

    const startTime = new Date()
    const endTime = new Date(startTime.getTime() + time * 1000 * 60)
    const pauseTime = startTime
    //  创建
    insertSign({
      method,
      activityId,
      location,
      startTime,
      endTime,
      pauseTime,
      status: SignStatus.ing,
    }).then(() => {
      res.send(Result.success())
    })
  })
})

module.exports = {
  prefix: '/sign',
  router,
}
