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
  console.time('handler');
  const { httpMethod, resource: eventResource, requestContext = {} } = event;
  const { identity = {} } = requestContext;
  const { sourceIp = 'unknown', userAgent = 'unknown' } = identity;
  return new Promise((resolve, reject) => {
    if (httpMethod && eventResource) {
      const resourceWithoutStage = eventResource.startsWith(`/${ENV}`)
        ? eventResource.slice(ENV.length + 1)
        : eventResource;
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
  })
    .then(sendProxySuccess.bind(), sendProxyError.bind())
    .then((response) => {
      const { statusCode = 0 } = response;
      console.log(`${sourceIp} (${userAgent}) - ${httpMethod} ${eventResource} [${statusCode}]`);
      console.timeEnd('handler');
      return response;
    });
}

module.exports = processRequest;
