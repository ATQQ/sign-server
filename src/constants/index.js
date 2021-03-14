// 一些常量
const Gender = {
  MALE: 1,
  FEMALE: 2,
}

const Time = {
  HOUR: 60 * 60,
  DAY: 60 * 60 * 24,
}

const StatusCode = {
  people: {
    exist: 10001,
    notExist: 10002,
  },
  nowPower: 99999,
  record: {
    invalidQRCode: 20001,
    invalidPWD: 20002,
    signOver: 20003,
    alreadySign: 20004,
    fail: 20005,
    notJoin: 20006,
  },
}

const SignStatus = {
  ing: 1,
  pause: 0,
  over: -1,
}

/**
 * 1:二维码,2:定位,3:拍照 4: 教师修改
 */
const SignMethod = {
  qrCode: 1,
  gps: 2,
  camera: 3,
  teacher: 4,
}

/**
 * 签到记录状态
 */
const RecordStatus = {
  success: 0,
  fail: 1,
  late: 2,
  notArrived: 3,
}
module.exports = {
  Gender,
  Time,
  StatusCode,
  SignStatus,
  SignMethod,
  RecordStatus,
}
