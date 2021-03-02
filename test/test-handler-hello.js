const { expect } = require('chai');
const aws = require('aws-sdk-mock');
const { request: handler } = require('../src/handler/handler-hello');
const event = require('./event.json');
const eventWebSocketConnect = require('./event-websocket-connect.json');
const eventWebSocketDisconnect = require('./event-websocket-disconnect.json');
const eventWebSocketMessage = require('./event-websocket-msg.json');

describe('Hello world test', () => {
  it('Return basic message', (done) => {
    const basicEvent = { ...event, httpMethod: 'GET', resource: '/hello' };
    const expectedBody = JSON.stringify({ msg: 'Hello world!' });
    handler(basicEvent)
      .then((response) => {
        const { body } = response;
        expect(body).to.equal(expectedBody);
        done();
      })
      .catch((error) => done(error));
  });

  it('WebSocket connect', (done) => {
    handler(eventWebSocketConnect)
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).to.equal(200);
        done();
      })
      .catch((error) => done(error));
  });

  it('WebSocket disconnect', (done) => {
    handler(eventWebSocketDisconnect)
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).to.equal(200);
        done();
      })
      .catch((error) => done(error));
  });

  it('WebSocket message', (done) => {
    aws.mock('ApiGatewayManagementApi', 'postToConnection', (params, callback) => {
      callback('', 'mocked');
    });
    handler(eventWebSocketMessage)
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).to.equal(200);
        done();
      })
      .catch((error) => done(error));
  });

  it('Unknown path', (done) => {
    const unknownEvent = { ...event, httpMethod: 'GET', resource: '/hello/world' };
    handler(unknownEvent)
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).to.equal(404);
        done();
      })
      .catch((error) => done(error));
  });
});
