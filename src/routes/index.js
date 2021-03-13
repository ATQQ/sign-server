const mainRouter = require('express').Router()

// const weChat = require('./modules/wechat');
const user = require('./modules/user')
const activity = require('./modules/activity')
const people = require('./modules/people')
const sign = require('./modules/sign');

[user, activity, people, sign].forEach(({ prefix, router }) => {
  mainRouter.use(prefix, router)
})

module.exports = mainRouter
