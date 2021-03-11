const router = require('express').Router()

const Result = require('../../utils/result')
const { code2session } = require('../../utils/wechatUtil')

router.get('/auth/code2session', (req, res) => {
  const { code } = req.query
  code2session(code).then(({ data }) => {
    res.send(Result.success(data))
  })
})

module.exports = {
  prefix: '/wechat',
  router,
}
