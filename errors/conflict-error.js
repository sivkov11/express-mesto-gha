const { ERROR_409 } = require('../errors/errors')

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_409;
  }
}

module.exports = ConflictError;