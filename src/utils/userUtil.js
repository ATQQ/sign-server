const LocalStorage = require('./storageUtil')

function getLoginUserInfo(req) {
  const data = LocalStorage.getItem(req.headers.token)
  return data && data.value
}

module.exports = {
  getLoginUserInfo,
}
