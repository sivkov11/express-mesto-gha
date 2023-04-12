const { ERROR_404 } = require('./errors');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = ERROR_404;
  }
}

module.exports = NotFoundError;
