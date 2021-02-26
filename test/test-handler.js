const { expect } = require('chai');
const { sendProxySuccess, sendProxyError, getResourceMethod } = require('../src/handler/handler');

describe('Handler test', () => {
  it('Success response', () => {
    const responseObj = 'test message';
    const okResponse = sendProxySuccess(responseObj);
    const { statusCode, body } = okResponse;
    expect(statusCode).to.equal(200);
    expect(body).to.equal(JSON.stringify(responseObj));
  });

  it('Error response', () => {
    const message = 'unknown error';
    const errorResponse = sendProxyError(new Error(message));
    const { statusCode, body } = errorResponse;
    const { errorMessage } = JSON.parse(body);
    expect(statusCode).to.equal(500);
    expect(errorMessage).to.equal(message);
  });

  it('Get resource method from map', () => {
    const resourceMethod = () => 'tested';
    const resourceMap = { '/test': { GET: resourceMethod } };

    expect(getResourceMethod('/test', 'GET', resourceMap)()).to.equal('tested');
  });
});
