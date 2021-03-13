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
}

const SignStatus = {
  ing: 1,
  pause: 0,
  over: -1,
}

/**
 * 1:二维码,2:定位,3:拍照 4: 教师修改
 */
const signMethod = {
  qrCode: 1,
  gps: 2,
  camera: 3,
  teacher: 4,
}
module.exports = {
  Gender,
  Time,
  StatusCode,
  SignStatus,
  signMethod,
}
