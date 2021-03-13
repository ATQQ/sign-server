const { ObjectId } = require('mongodb')
const LocalStorage = require('./storageUtil')
const { Time } = require('../constants')

function testFn() {
  // todo: 注入用于测试的数据
  LocalStorage.setItem('testtoken', {
    _id: ObjectId('604ada4731658e2cae7adacf'),
    userId: 'o4g1P5Dz3edA4XlkirYshrAK7S5Y',
    nickname: '哄哄',
    gender: 2,
    lastLogin: new Date('2021-03-12T03:01:20.132Z'),
    loginCount: 3,
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q3auHgzwzM5fsF5ePQjOo1lmbt1bmApOQ8RhLdy1YCsiaicIeREIjXO0P75OX3hOaVbPy1WDhbrlanfxuaqlH4Yw/132',
    lastDate: new Date('2021-03-12T03:07:38.739Z'),
  },
  Time.HOUR)
}

module.exports = {
  testFn,
}
