const { ObjectId } = require('mongodb')
const { findSignByStatus } = require('../db/modules/signDb')
const { SignStatus } = require('../constants')
const { updateCollection } = require('../db/modules/public')
const { getUniqueId } = require('./stringUtil')

/**
 * 轮循查询/更新签到表状态
 */
async function updateSignStatus() {
  findSignByStatus(SignStatus.ing).then((data) => {
    if (data.length === 0) {
      setTimeout(updateSignStatus, 1000)
      return
    }
    const shouldEnd = data.filter((sign) => {
      const { endTime } = sign
      return endTime < new Date()
    })
    if (!shouldEnd || shouldEnd.length === 0) {
      setTimeout(updateSignStatus, 1000)
      return
    }
    shouldEnd.forEach((sign) => {
      console.log(sign.signId, '结束')
    })
    updateCollection('sign',
      {
        $or: shouldEnd.map((sign) => ({ signId: sign.signId })),
      },
      {
        $set: {
          status: SignStatus.over,
        },
      }, true).then(() => {
      setTimeout(updateSignStatus, 1000)
    }).catch(() => {
      setTimeout(updateSignStatus, 1000)
    })
  })
}

/**
 * 轮循查询/更新签到表的二维码
 */
async function updateSignQrCode(updateTime = 15) {
  findSignByStatus(SignStatus.ing).then((data) => {
    if (data.length === 0) {
      setTimeout(updateSignQrCode, 1000)
      return
    }
    const shouldEnd = data.filter((sign) => {
      const { qrcode } = sign
      let { qrTime = updateTime } = sign
      if (typeof qrTime !== 'number' || qrTime < 1) {
        qrTime = updateTime
      }
      return (ObjectId(qrcode).getTimestamp().getTime() + 1000 * qrTime) <= Date.now()
    })
    if (!shouldEnd || shouldEnd.length === 0) {
      setTimeout(updateSignQrCode, 1000)
      return
    }
    shouldEnd.forEach((sign) => {
      console.log(sign.signId, '更新二维码')
    })
    updateCollection('sign',
      {
        $or: shouldEnd.map((sign) => ({ signId: sign.signId })),
      },
      {
        $set: {
          qrcode: getUniqueId(),
        },
      }, true).then(() => {
      setTimeout(updateSignQrCode, 1000)
    }).catch(() => {
      setTimeout(updateSignQrCode, 1000)
    })
  })
}
module.exports = {
  updateSignStatus,
  updateSignQrCode,
}
