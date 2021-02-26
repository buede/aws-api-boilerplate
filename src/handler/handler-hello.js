const { processRequest } = require('./handler');

// Map your functions to http events here
const RESOURCE_MAP = {
  '/hello': {
    GET: () => ({ msg: 'Hello world!' }),
  },
};

exports.request = async (event) => processRequest(event, RESOURCE_MAP);
