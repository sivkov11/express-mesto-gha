const { ERROR_403 } = require('./errors');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.status = ERROR_403;
  }
}

module.exports = ForbiddenError;
