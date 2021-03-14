class Result {
  constructor(data, code = 0, msg = 'ok') {
    this.code = code
    this.msg = msg
    this.data = data
  }

  static success(data) {
    return new Result(data)
  }

  static fail(code = 500, msg = 'fail', data = undefined) {
    return new Result(data, code, msg)
  }
}

module.exports = Result
