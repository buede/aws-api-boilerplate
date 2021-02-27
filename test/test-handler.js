/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const { sendProxySuccess, sendProxyError, getResourceMethod } = require('../src/handler/handler');
const Response = require('../src/model/Response');
const GenericError = require('../src/error/GenericError');

describe('Handler test', () => {
  describe('Success response', () => {
    it('200 response', () => {
      const okResponse = sendProxySuccess(new Response());
      const { statusCode, body } = okResponse;
      expect(statusCode).to.equal(200);
      expect(body).to.be.null;
    });
    it('200 response with text body', () => {
      const responseObj = 'test message';
      const okResponse = sendProxySuccess(responseObj);
      const { statusCode, body } = okResponse;
      expect(statusCode).to.equal(200);
      expect(body).to.equal(JSON.stringify(responseObj));
    });
    it('200 response with object body', () => {
      const responseObj = { message: 'test message' };
      const okResponse = sendProxySuccess(responseObj);
      const { statusCode, body } = okResponse;
      expect(statusCode).to.equal(200);
      expect(body).to.equal(JSON.stringify(responseObj));
    });
    it('201 response', () => {
      const responseObj = { message: 'test message' };
      const okResponse = sendProxySuccess(new Response(responseObj, 201));
      const { statusCode, body } = okResponse;
      expect(statusCode).to.equal(201);
      expect(body).to.equal(JSON.stringify(responseObj));
    });
    it('204 response', () => {
      const okResponse = sendProxySuccess(new Response(null, 204));
      const { statusCode, body } = okResponse;
      expect(statusCode).to.equal(204);
      expect(body).to.be.null;
    });
  });

  describe('Error response', () => {
    it('500 response', () => {
      const message = 'unknown error';
      const errorResponse = sendProxyError(new Error(message));
      const { statusCode, body } = errorResponse;
      const { errorMessage } = JSON.parse(body);
      expect(statusCode).to.equal(500);
      expect(errorMessage).to.equal(message);
    });
    it('501 response', () => {
      const message = 'unknown error';
      const errorResponse = sendProxyError(new GenericError(message, 501));
      const { statusCode, body } = errorResponse;
      const { errorMessage } = JSON.parse(body);
      expect(statusCode).to.equal(501);
      expect(errorMessage).to.equal(message);
    });
  });

  describe('Resource map', () => {
    it('Get resource method from map', () => {
      const resourceMethod = () => 'tested';
      const resourceMap = { '/test': { GET: resourceMethod } };

      expect(getResourceMethod('/test', 'GET', resourceMap)()).to.equal('tested');
    });

    it('Route not found', (done) => {
      const resourceMethod = () => 'tested';
      const resourceMap = { '/test': { GET: resourceMethod } };

      try {
        getResourceMethod('/testing', 'GET', resourceMap)();
        done(new Error());
      } catch (error) {
        const { statusCode, message } = error;
        expect(statusCode).to.equal(404);
        expect(message).to.equal('Route not found');
        done();
      }
    });

    it('Route not found with missing resource map', (done) => {
      try {
        getResourceMethod('/testing', 'GET')();
        done(new Error());
      } catch (error) {
        const { statusCode, message } = error;
        expect(statusCode).to.equal(404);
        expect(message).to.equal('Route not found');
        done();
      }
    });

    it('Unknown event resource', (done) => {
      const resourceMethod = () => 'tested';
      const resourceMap = { '/test': { GET: resourceMethod } };

      try {
        getResourceMethod(null, 'GET', resourceMap)();
        done(new Error());
      } catch (error) {
        const { message } = error;
        expect(message).to.equal('Unknown event resource');
        done();
      }
    });

    it('Unknown http method', (done) => {
      const resourceMethod = () => 'tested';
      const resourceMap = { '/test': { GET: resourceMethod } };

      try {
        getResourceMethod('/test', null, resourceMap)();
        done(new Error());
      } catch (error) {
        const { message } = error;
        expect(message).to.equal('Unknown HTTP method');
        done();
      }
    });
  });
});
