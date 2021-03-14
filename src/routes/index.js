const mainRouter = require('express').Router()

// const weChat = require('./modules/wechat');
const user = require('./modules/user')
const activity = require('./modules/activity')
const people = require('./modules/people')
const sign = require('./modules/sign')
const record = require('./modules/record');

[user, activity, people, sign, record].forEach(({ prefix, router }) => {
  mainRouter.use(prefix, router)
})

module.exports = mainRouter
