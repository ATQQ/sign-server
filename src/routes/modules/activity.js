const router = require('express').Router()

const { insertActivity, findManageActivities, updateActivityInfo } = require('../../db/modules/activityDb')
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

module.exports = {
  prefix: '/activity',
  router,
}
