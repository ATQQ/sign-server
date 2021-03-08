const axios = require('axios').default

function code2session(code) {
  return axios.get('/sns/jscode2session', {
    baseURL: 'https://api.weixin.qq.com',
    params: {
      js_code: code,
      appid: process.env.WECHAT_APPID,
      secret: process.env.WECHAT_SECRET,
      grant_type: 'authorization_code',
    },
  })
}

module.exports = {
  code2session,
}
