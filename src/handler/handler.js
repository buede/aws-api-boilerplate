const Error404 = require('../error/Error404');
const GenericError = require('../error/GenericError');
const Response = require('../model/Response');

const ENV = process.env.SERVERLESS_STAGE || 'dev';

function sendProxySuccess(responseObj) {
  console.debug(`Response: ${JSON.stringify(responseObj)}`);
  return Response.parse(responseObj).getResponse();
}

function sendProxyError(err) {
  console.debug(err);
  const error = GenericError.parse(err);
  return Response.parse(error).getResponse();
}

function processRequest(event, resourceMap) {
  return new Promise((resolve, reject) => {
    if (event.httpMethod && event.resource) {
      const { resource: eventResource, httpMethod } = event;
      const resourceWithoutStage = eventResource.startsWith(`/${ENV}`)
        ? eventResource.slice(ENV.length + 1)
        : eventResource;
      console.debug('PROCESSING HTTP EVENT', httpMethod, eventResource, resourceWithoutStage);
      const resource = resourceMap[resourceWithoutStage];
      const resourceMethod = resource && resource[httpMethod];
      if (!resourceMethod) reject(new Error404('Route Not Found'));
      else {
        try {
          resolve(resourceMethod(event));
        } catch (error) {
          reject(error);
        }
      }
    } else {
      console.log('UNKNOWN EVENT', event);
      resolve({});
    }
  }).then(sendProxySuccess.bind(), sendProxyError.bind());
}

module.exports = processRequest;
