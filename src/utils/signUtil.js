const { findSignByStatus } = require('../db/modules/signDb')
const { SignStatus } = require('../constants')
const { updateCollection } = require('../db/modules/public')

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

module.exports = {
  updateSignStatus,
}
