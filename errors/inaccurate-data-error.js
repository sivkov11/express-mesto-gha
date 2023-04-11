const { ERROR_400 } = require('../errors/errors')

class InaccurateDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_400;
  }
}

module.exports = InaccurateDataError;