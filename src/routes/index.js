const mainRouter = require('express').Router()

const weChat = require('./modules/wechat');

[weChat].forEach(({ prefix, router }) => {
  mainRouter.use(prefix, router)
})

module.exports = mainRouter
