const { ERROR_403 } = require('../errors/errors')

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_403;
  }
}

module.exports = ForbiddenError;