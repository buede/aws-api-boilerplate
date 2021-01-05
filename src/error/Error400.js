const GenericError = require('./GenericError');

class Error400 extends GenericError {
  constructor(message) {
    super(message || 'Bad request!', 400);
  }
}

module.exports = Error400;
