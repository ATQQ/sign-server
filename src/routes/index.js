const mainRouter = require('express').Router()

// const weChat = require('./modules/wechat');
const user = require('./modules/user')
const activity = require('./modules/activity')
const people = require('./modules/people');

[user, activity, people].forEach(({ prefix, router }) => {
  mainRouter.use(prefix, router)
})

module.exports = mainRouter
