const Error404 = require('../error/Error404');
const GenericError = require('../error/GenericError');
const Response = require('../model/Response');

function sendProxySuccess(responseObj) {
  console.debug(`Response: ${JSON.stringify(responseObj)}`);
  return Response.parse(responseObj).getResponse();
}

function sendProxyError(err) {
  console.debug(err);
  const error = GenericError.parse(err);
  return Response.parse(error).getResponse();
}

function getResourceMethod(eventResource, httpMethod, resourceMap = {}) {
  const env = process.env.SERVERLESS_STAGE || 'dev';
  const resourceWithoutStage = eventResource.startsWith(`/${env}`)
    ? eventResource.slice(env.length + 1)
    : eventResource;
  const {
    [resourceWithoutStage]: {
      [httpMethod]: resourceMethod = () => {
        throw new Error404('Route Not Found');
      },
    } = {},
  } = resourceMap;
  return resourceMethod;
}

function processRequest(event, resourceMap) {
  console.time('handler');
  const {
    httpMethod,
    resource: eventResource,
    requestContext: { identity: { sourceIp = 'unknown', userAgent = 'unknown' } = {} } = {},
  } = event;
  return new Promise((resolve, reject) => {
    if (httpMethod && eventResource) {
      const resourceMethod = getResourceMethod(eventResource, httpMethod, resourceMap);
      try {
        resolve(resourceMethod(event));
      } catch (error) {
        reject(error);
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

module.exports = { sendProxySuccess, sendProxyError, getResourceMethod, processRequest };
