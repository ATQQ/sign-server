const router = require('express').Router()
const localStorage = require('../../utils/storageUtil')

const { updateCollection } = require('../../db/modules/public')
const { findUser, insertUser } = require('../../db/modules/userDb')
const Result = require('../../utils/result')
const { code2session } = require('../../utils/wechatUtil')
const { Time,WebHost } = require('../../constants')
const { getV, setKV } = require('../../db/modules/redisDb')
const { randomNumStr } = require('../../utils/randUtil')

router.post('/login', (req, res) => {
  // TODO: 返回登录失败
  // 如果携带有旧的那么过期旧的
  // 异步的,短时间的codeSession是一样的,会导致一直无权限
  // if (req.headers.token) {
  //   localStorage.expireItem(req.headers.token)
  // }
  const {
    code, nickname, gender, avatar,
  } = req.body
  code2session(code).then(async ({ data }) => {
    const { openid, session_key } = data
    let [user] = await findUser({
      userId: openid,
    })
    // 不存在插入数据
    if (!user) {
      // 插入数据库
      const { ops } = await insertUser(openid, {
        gender,
        nickname,
        avatar,
      });

      ([user] = ops)
    } else {
      // 异步更新最后登录时间
      // 更新登录次数
      updateCollection('user', {
        userId: user.userId,
      }, {
        $set: {
          lastLogin: new Date(),
          loginCount: user.loginCount + 1,
          gender,
          nickname,
          avatar,
        },
      })
    }
    // 将key - user信息存入服务端的Storage中
    // 2小时过期
    localStorage.setItem(session_key, user, Time.HOUR * 2)
    // 将session_key作为token回传
    res.send(Result.success(session_key))
  })
})

/**
 * 获取Web端链接
 */
router.get('/web', (req, res) => {
  const token = req.headers.token
  res.send(Result.success({
    link: `${WebHost}?token=${token}`
  }))
})

/**
 * 获取用于登录的验证码
 */
router.get('/login/code', async (req, res) => {
  const token = req.headers.token
  let t = ''
  let num = randomNumStr(4)
  while (true) {
    t = await getV(num)
    if (!t) {
      break
    }
    num = randomNumStr(4)
  }
  setKV(num, token)
  res.send(Result.success({
    num
  }))
})

/**
 * 换取登录token
 */
router.post('/login/code', async (req, res) => {
  const { code } = req.body
  const token = await getV(code)
  // 过期
  setKV(code,'',1)
  res.send(Result.success(token))
})

module.exports = {
  prefix: '/user',
  router,
}
