const router = require('express').Router()

const { findUser, insertUser } = require('../../db/modules/userDb')
const Result = require('../../utils/result')
const { code2session } = require('../../utils/wechatUtil')

router.post('/login', (req, res) => {
  const { code, nickName, gender } = req.body
  code2session(code).then(async ({ data }) => {
    const { openid, session_key } = data
    let [user] = await findUser({
      userId: openid,
    })
    // 不存在插入数据
    if (!user) {
      // 插入数据库
      const { ops, insertedCount } = await insertUser(openid, gender, nickName)
      // TODO: 返回登录失败
      if (insertedCount !== 1) {
        // res.send(Result)
        // return
        console.log('登录失败')
      }
      ([user] = ops)
    } else {
      // 更新最后登录时间
      // 更新登录次数
    }
    console.log(user)
    // 将key - user信息存入服务端的Storage中
    // 将session_key作为token回传
    res.send(Result.success(session_key))
  })
})

module.exports = {
  prefix: '/user',
  router,
}
