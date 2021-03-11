const mainRouter = require('express').Router()

// const weChat = require('./modules/wechat');
const user = require('./modules/user');

[user].forEach(({ prefix, router }) => {
  mainRouter.use(prefix, router)
})

module.exports = mainRouter
