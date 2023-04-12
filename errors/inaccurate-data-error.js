const { ERROR_400 } = require('./errors');

class InaccurateDataError extends Error {
  constructor(message) {
    super(message);
    this.status = ERROR_400;
  }
}

module.exports = InaccurateDataError;
