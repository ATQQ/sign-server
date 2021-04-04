const LocalStorage = require('./storageUtil')

async function getLoginUserInfo(req) {
  const data = await LocalStorage.getItem(req.headers.token)
  return data || {}
}

module.exports = {
  getLoginUserInfo,
}
