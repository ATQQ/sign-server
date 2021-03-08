const router = require('express').Router()

const { code2session } = require('../../utils/wechatUtil')

router.get('/auth/code2session', (req, res) => {
  const { code } = req.query
  code2session(code).then(({ data }) => {
    console.log(data)
    res.send({
      code: 0,
      errMsg: 'success',
    })
  })
})

module.exports = {
  prefix: '/wechat',
  router,
}
