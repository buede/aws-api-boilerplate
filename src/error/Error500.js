const GenericError = require('./GenericError');

class Error500 extends GenericError {
  constructor(message) {
    super(message || 'Server error!', 500);
  }
}

module.exports = Error500;
