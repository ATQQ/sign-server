class Result {
  constructor(data, code = 0, msg = 'ok') {
    this.code = code
    this.msg = msg
    this.data = data
  }

  static success(data) {
    return new Result(data)
  }
}

module.exports = Result
