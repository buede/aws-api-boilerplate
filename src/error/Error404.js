const GenericError = require('./GenericError');

class Error404 extends GenericError {
  constructor(message) {
    super(message || 'Object not found!', 404);
  }
}

module.exports = Error404;
