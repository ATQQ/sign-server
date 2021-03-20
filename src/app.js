const dotenv = require('dotenv')
const express = require('express')

// 读取-打印环境变量
// 读取.env环境变量配置文件
console.log('引入自定义的环境变量')
console.log(dotenv.config())

const { serverConfig } = require('./config')
const { testFn } = require('./utils/testUtil')
const { getLoginUserInfo } = require('./utils/userUtil')
const Result = require('./utils/result')
const { StatusCode } = require('./constants')
// 用户的所有路由
const mainRouter = require('./routes')
const { updateSignStatus, updateSignQrCode } = require('./utils/signUtil')

// 实例化express
const app = express()

// 注册一些中间件
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ strict: true }))

// 首先进入的路由(全局的拦截器)
app.route('*').all((req, res, next) => {
  console.log(`${req.method}--${req.url}`)
  const { userId } = getLoginUserInfo(req)
  // 登录校验
  if (req.url !== '/user/login' && !userId) {
    res.send(Result.fail(StatusCode.nowPower, 'no power'))
    return
  }
  next()
})
// 注册所有路由
app.use(mainRouter)

// 开发环境添加用于测试的逻辑
if (process.env.npm_lifecycle_event === 'dev') {
  testFn()
}

app.listen(serverConfig.port, serverConfig.hostname, () => {
  updateSignStatus()
  updateSignQrCode(10)
  console.log(`server start at ${serverConfig.hostname}:${serverConfig.port}`)
})

module.exports = app
