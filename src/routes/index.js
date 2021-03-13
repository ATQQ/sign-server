const mainRouter = require('express').Router()

// const weChat = require('./modules/wechat');
const user = require('./modules/user')
const activity = require('./modules/activity');

[user, activity].forEach(({ prefix, router }) => {
  mainRouter.use(prefix, router)
})

module.exports = mainRouter
