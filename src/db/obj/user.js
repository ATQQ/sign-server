const { Gender } = require('../../constants/index')

const defaultOptions = {
  nickname: '随机',
  gender: Gender.MALE,
  lastLogin: new Date(),
  loginCount: 0,
}
class User {
  constructor(userId, options = {}) {
    const ops = Object.assign(defaultOptions, options)
    this.userId = userId
    this.nickname = ops.nickname
    this.gender = ops.gender
    this.lastLogin = ops.lastLogin
    this.loginCount = ops.loginCount
  }
}

module.exports = User
