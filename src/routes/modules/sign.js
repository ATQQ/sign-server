const router = require('express').Router()

const { StatusCode, SignStatus } = require('../../constants')
const { findActivity } = require('../../db/modules/activityDb')

const {
  insertSign, findSignById, updateSign, findSignByActivityId,
} = require('../../db/modules/signDb')
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

/**
 * 更改签到表状态
 */
router.put('/:id', async (req, res) => {
  const { id: signId } = req.params
  const { status, time = 0 } = req.body
  const addTime = 1000 * 60 * Math.abs(~~(time))
  const [signData] = await findSignById(signId)
  if (!signData) {
    res.send(Result.fail(StatusCode.nowPower, 'no power'))
    return
  }

  switch (status) {
    case SignStatus.ing:
      // 暂停 -> 开始
      if (signData.status === SignStatus.pause) {
        const endTime = new Date(Date.now() + addTime + (signData.endTime - signData.pauseTime))
        await updateSign({
          signId,
        }, {
          endTime,
          status,
        })
      }

      // 结束 -> 延长时间继续开始
      if (signData.status === SignStatus.over) {
        const endTime = new Date(Date.now() + addTime)
        await updateSign({
          signId,
        }, {
          endTime,
          status,
        })
      }
      break
    case SignStatus.pause:
      // 进行中 -> 暂停
      if (signData.status === SignStatus.ing) {
        await updateSign({
          signId,
        }, {
          pauseTime: new Date(),
          status,
        })
      }
      break
    case SignStatus.over:
      await updateSign({
        signId,
      }, {
        endTime: new Date(),
        status,
      })
      break
    default:
      res.send(Result.fail(StatusCode.nowPower, 'no power'))
      return
  }
  res.send(Result.success())
})

/**
 * 获取指定签到表的信息
 */
router.get('/:id', async (req, res) => {
  const { id: signId } = req.params
  findSignById(signId).then((data) => {
    res.send(Result.success(data[0]))
  })
})

/**
 * 获取活动的签到表信息
 */
router.get('/list/:id', async (req, res) => {
  const { id: activityId } = req.params
  findSignByActivityId(activityId).then((data) => {
    res.send(Result.success({
      sign_list: data,
    }))
  })
})
module.exports = {
  prefix: '/sign',
  router,
}
