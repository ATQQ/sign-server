const router = require('express').Router()

const { insertActivity } = require('../../db/modules/activityDb')
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

module.exports = {
  prefix: '/activity',
  router,
}
