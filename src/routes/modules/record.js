const router = require('express').Router()
const {
  SignMethod, StatusCode, SignStatus, RecordStatus,
} = require('../../constants')
const { findActivity } = require('../../db/modules/activityDb')
const { findPeople, findPeopleById } = require('../../db/modules/peopleDb')
const {
  findRecordByUserIdAndSignId,
  updateRecord, insertRecord, findRecordByPeopleIdAndSignId, findRecordBySignId,
} = require('../../db/modules/recordDb')
const { findSignByQcCode, findSignByPwd, findSignById } = require('../../db/modules/signDb')
const Result = require('../../utils/result')
const { getLoginUserInfo } = require('../../utils/userUtil')

/**
 * 用户参与签到
 */
router.post('/sign', async (req, res) => {
  const {
    location = '', method, photo = '', qrcode, pwd,
  } = req.body
  const { userId } = await getLoginUserInfo(req)
  let signData = null
  // 查找到签到表的基本信息
  // 合法性校验
  if (qrcode) {
    ([signData] = await findSignByQcCode(qrcode))
    // 无效二维码
    if (!signData) {
      res.send(Result.fail(StatusCode.record.invalidQRCode, 'Invalid QR Code'))
      return
    }
  }

  if (pwd) {
    ([signData] = await findSignByPwd(pwd))
    // 无效签到口令
    if (!signData) {
      res.send(Result.fail(StatusCode.record.invalidPWD, 'Invalid PWD'))
      return
    }
  }

  const [people] = await findPeople(userId, signData.activityId)

  // 未加入 - 返回课程口令用于加入
  if (!people) {
    const [activity] = await findActivity({
      activityId: signData.activityId,
    })
    res.send(Result.fail(StatusCode.record.notJoin, 'not join', { pwd: activity.pwd }))
    return
  }

  // 签到已截止
  if (signData.status !== SignStatus.ing) {
    res.send(Result.fail(StatusCode.record.signOver, 'sign is over'))
    return
  }
  const [recordData] = await findRecordByUserIdAndSignId(userId, signData.signId)
  // 已经参与过签到
  if (recordData) {
    // 状态不为失败  说明成功参与过了
    if (recordData.status !== RecordStatus.fail && recordData.status !== RecordStatus.not) {
      res.send(Result.fail(StatusCode.record.alreadySign, 'already sign'))
      return
    }
    // 原状态为失败
    // 成功进行二维码签到
    if (method === SignMethod.qrCode) {
      updateRecord({
        recordId: recordData.recordId,
      }, {
        status: RecordStatus.success,
        method,
        lastTime: new Date(),
        location,
      }).then(() => {
        res.send(Result.success())
      })
    }

    // 定位签到
    if (method === SignMethod.gps) {
    // TODO: 判断地址是否欧克的逻辑
      // 成功
      if (location === signData.location) {
        updateRecord({
          recordId: recordData.recordId,
        }, {
          status: RecordStatus.success,
          method,
          lastTime: new Date(),
          location,
        }).then(() => {
          res.send(Result.success())
        })
      } else {
        // 失败
        updateRecord({
          recordId: recordData.recordId,
        }, {
          method,
          lastTime: new Date(),
          location,
        }).then(() => {
          res.send(Result.fail(StatusCode.record.fail))
        })
      }
    }

    // 拍照审核
    if (method === SignMethod.camera) {
      updateRecord({
        recordId: recordData.recordId,
      }, {
        status: RecordStatus.fail,
        method,
        lastTime: new Date(),
        location,
        photo,
      }).then(() => {
        res.send(Result.success())
      })
    }
    return
  }
  // 第一次提交
  if (!recordData) {
    const baseOptions = {
      peopleId: people.peopleId,
      userId,
      name: people.name,
      signId: signData.signId,
      activityId: signData.activityId,
      location,
      method,
    }
    // 成功进行二维码签到
    if (method === SignMethod.qrCode) {
      insertRecord({
        ...baseOptions,
        status: RecordStatus.success,
      }).then(() => {
        res.send(Result.success())
      })
    }

    // 定位签到
    if (method === SignMethod.gps) {
      // TODO: 判断地址是否欧克的逻辑
      // 成功
      if (location === signData.location) {
        insertRecord({
          ...baseOptions,
          status: RecordStatus.success,
        }).then(() => {
          res.send(Result.success())
        })
      } else {
        // 失败
        insertRecord({
          ...baseOptions,
          status: RecordStatus.fail,
        }).then(() => {
          res.send(Result.fail(StatusCode.record.fail))
        })
      }
    }

    // 拍照审核
    if (method === SignMethod.camera) {
      insertRecord({
        ...baseOptions,
        photo,
        status: RecordStatus.fail,
      }).then(() => {
        res.send(Result.success())
      })
    }
  }
})

/**
 * 教师更改学生签到状态
 */
router.put('/status/:id', async (req, res) => {
  const { id: peopleId } = req.params
  const { signId, status } = req.body
  const { userId } = await getLoginUserInfo(req)
  const [people] = await findPeopleById(peopleId)
  // 修改的用户不存在
  if (!people) {
    res.send(Result.fail(StatusCode.nowPower))
    return
  }
  const [activity] = await findActivity({
    activityId: people.activityId,
    userId,
  })
  // 当前用户无此活动权限
  if (!activity) {
    res.send(Result.fail(StatusCode.nowPower))
    return
  }
  const [recordData] = await findRecordByPeopleIdAndSignId(peopleId, signId)
  // 系统没有记录
  if (!recordData) {
    insertRecord({
      peopleId: people.peopleId,
      userId: people.userId,
      name: people.name,
      signId,
      activityId: people.activityId,
      method: SignMethod.teacher,
      status,
    }).then(() => {
      res.send(Result.success())
    })
    return
  }
  updateRecord({
    recordId: recordData.recordId,
  }, {
    status,
    method: SignMethod.teacher,
    lastTime: new Date(),
  }).then(() => {
    res.send(Result.success())
  })
})

/**
 * 教师更新批注信息
 */
router.put('/tips/:id', async (req, res) => {
  const { id: peopleId } = req.params
  const { signId, tips } = req.body
  const { userId } = await getLoginUserInfo(req)
  const [people] = await findPeopleById(peopleId)
  // 修改的用户不存在
  if (!people) {
    res.send(Result.fail(StatusCode.nowPower))
    return
  }
  const [activity] = await findActivity({
    activityId: people.activityId,
    userId,
  })
  // 当前用户无此活动权限
  if (!activity) {
    res.send(Result.fail(StatusCode.nowPower))
    return
  }
  const [recordData] = await findRecordByPeopleIdAndSignId(peopleId, signId)
  // 系统没有记录
  if (!recordData) {
    insertRecord({
      peopleId: people.peopleId,
      userId: people.userId,
      name: people.name,
      signId,
      activityId: people.activityId,
      method: SignMethod.teacher,
      status: RecordStatus.not,
      tips,
    }).then(() => {
      res.send(Result.success())
    })
    return
  }
  updateRecord({
    recordId: recordData.recordId,
  }, {
    method: SignMethod.teacher,
    tips,
    lastTime: new Date(),
  }).then(() => {
    res.send(Result.success())
  })
})

router.get('/:id', async (req, res) => {
  const { id: signId } = req.params
  const { userId } = await getLoginUserInfo(req)
  const [signData] = await findSignById(signId)
  // 此表不存在
  if (!signData) {
    res.send(Result.fail(StatusCode.nowPower))
    return
  }
  const [activity] = await findActivity({
    activityId: signData.activityId,
    userId,
  })
  // 当前用户无此活动权限
  if (!activity) {
    res.send(Result.fail(StatusCode.nowPower))
    return
  }
  findRecordBySignId(signId).then((records) => {
    res.send(Result.success({
      records,
    }))
  })
})
module.exports = {
  prefix: '/record',
  router,
}
