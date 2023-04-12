const { ERROR_401 } = require('./errors');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = ERROR_401;
  }
}

module.exports = UnauthorizedError;
