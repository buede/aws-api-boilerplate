class Response {
  constructor(body, statusCode = 200) {
    this.statusCode = statusCode;
    this.body = body;
    this.headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };
  }

  getResponse() {
    return {
      statusCode: this.statusCode,
      body: this.body
        ? (typeof this.body === 'object' && JSON.stringify(this.body)) || this.body
        : null,
      headers: this.headers,
    };
  }

  static parse(obj, statusCode) {
    if (obj instanceof Response) {
      return obj;
    }
    if (obj.name === 'GenericError') {
      return new Response(obj.body, obj.statusCode);
    }
    return new Response(obj, statusCode);
  }
}

module.exports = Response;
