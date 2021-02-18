class GenericError extends Error {
  constructor(message = 'Unknown error', statusCode = 500) {
    // Superclass part
    super(message);
    this.name = this.constructor.name;
    // HTTP response part
    this.statusCode = statusCode;
    this.body = {
      errorMessage: message,
    };
  }

  static parse(error) {
    if (error.name === 'GenericError') {
      return error;
    }
    return new GenericError(error.message, error.statusCode || 500);
  }
}

module.exports = GenericError;
