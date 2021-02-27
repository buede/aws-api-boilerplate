const { expect } = require('chai');
const { request: handler } = require('../src/handler/handler-hello');

let event;

beforeEach(() => {
  // eslint-disable-next-line global-require
  event = require('./event.json');
});

describe('Hello world test', () => {
  it('Return basic message', (done) => {
    const expectedBody = JSON.stringify({ msg: 'Hello world!' });
    event.httpMethod = 'GET';
    event.resource = '/hello';
    handler(event)
      .then((response) => {
        const { body } = response;
        expect(body).to.equal(expectedBody);
        done();
      })
      .catch((error) => done(error));
  });

  it('Unknown path', (done) => {
    const expectedStatusCode = 404;
    event.httpMethod = 'GET';
    event.resource = '/hello/world';
    handler(event)
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).to.equal(expectedStatusCode);
        done();
      })
      .catch((error) => done(error));
  });
});
