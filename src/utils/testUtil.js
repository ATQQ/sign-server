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
  LocalStorage.setItem('testtoken2', {
    _id: ObjectId('604ad9e031658e2cae7adace'),
    userId: 'o4g1P5Favk2RG7-MRT8zuR5HLLtY',
    nickname: 'forever',
    gender: 1,
    lastLogin: new Date('2021-03-12T03:01:20.132Z'),
    loginCount: 21,
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/vL2hU0AibKEfanH3xu0XbO7nf843JOhica8iaN91Qf1s6mswBeSg686uGa1bautWiaGCic1shX8gAxXJscs2tdPbaOw/132',
    lastDate: new Date('2021-03-12T08:12:09.645Z'),
  },
  Time.HOUR)
}

module.exports = {
  testFn,
}
