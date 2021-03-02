const Error400 = require('../error/Error400');
const Error404 = require('../error/Error404');
const GenericError = require('../error/GenericError');
const Response = require('../model/Response');

function sendProxySuccess(responseObj) {
  const response = Response.parse(responseObj).getResponse();
  console.debug(`Response: ${JSON.stringify(response)}`);
  return response;
}

function sendProxyError(err) {
  console.debug(err);
  const error = GenericError.parse(err);
  return Response.parse(error).getResponse();
}

function getResourceMethod(eventResource, httpMethod, resourceMap = {}) {
  if (!eventResource) throw new Error400('Unknown event resource');
  if (!httpMethod) throw new Error400('Unknown HTTP method');

  const env = process.env.SERVERLESS_STAGE || 'dev';
  const resourceWithoutStage = eventResource.startsWith(`/${env}`)
    ? eventResource.slice(env.length + 1)
    : eventResource;
  const {
    [resourceWithoutStage]: {
      [httpMethod]: resourceMethod = () => {
        throw new Error404('Route not found');
      },
    } = {},
  } = resourceMap;
  return resourceMethod;
}

function getEventData(event) {
  const {
    httpMethod,
    resource,
    requestContext: {
      identity: { sourceIp = 'unknown', userAgent = 'unknown' } = {},
      routeKey,
    } = {},
  } = event;

  return {
    eventResource: resource || 'WebSocket',
    eventAction: httpMethod || routeKey,
    sourceIp,
    userAgent,
  };
}

function processRequest(event, resourceMap) {
  console.time('handler');
  const { eventResource, eventAction, sourceIp, userAgent } = getEventData(event);
  return new Promise((resolve, reject) => {
    const resourceMethod = getResourceMethod(eventResource, eventAction, resourceMap);
    try {
      resolve(resourceMethod(event));
    } catch (error) {
      reject(error);
    }
  })
    .then(sendProxySuccess.bind(), sendProxyError.bind())
    .then((response) => {
      const { statusCode = 0 } = response;
      console.log(`${sourceIp} (${userAgent}) - ${eventAction} ${eventResource} [${statusCode}]`);
      console.timeEnd('handler');
      return response;
    });
}

module.exports = {
  sendProxySuccess,
  sendProxyError,
  getResourceMethod,
  getEventData,
  processRequest,
};
