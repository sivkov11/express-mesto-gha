const { ERROR_404 } = require('../errors/errors')

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_404;
  }
}

module.exports = NotFoundError;