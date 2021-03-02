const AWS = require('aws-sdk');
const { processRequest } = require('./handler');

// Map your functions to http events here
const RESOURCE_MAP = {
  '/hello': {
    GET: () => ({ msg: 'Hello world!' }),
  },
  WebSocket: {
    $connect: () => 'Connected',
    $disconnect: () => 'Disconnected',
    sendMessage: (event) => {
      const { body: bodyStr, requestContext: { connectionId, domainName, stage } = {} } = event;
      const { message } = JSON.parse(bodyStr);
      const endpoint =
        domainName === 'localhost' ? 'http://localhost:3001' : `https://${domainName}/${stage}`;
      console.log(`Message received: ${message}`);
      const api = new AWS.ApiGatewayManagementApi({ endpoint });
      return api
        .postToConnection({
          ConnectionId: connectionId,
          Data: 'Hello',
        })
        .promise()
        .then(() => null);
    },
  },
};

exports.request = async (event) => {
  console.log(JSON.stringify(event));
  return processRequest(event, RESOURCE_MAP);
};
