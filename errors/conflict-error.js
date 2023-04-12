const { ERROR_409 } = require('./errors');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.status = ERROR_409;
  }
}

module.exports = ConflictError;
