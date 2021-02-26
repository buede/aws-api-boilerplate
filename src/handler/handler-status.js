const { processRequest } = require('./handler');

const PROJECT = process.env.SERVERLESS_PROJECT;
const STAGE = process.env.SERVERLESS_STAGE;
const REGION = process.env.SERVERLESS_REGION;

// Map your functions to http events here
const RESOURCE_MAP = {
  '/status': {
    GET: () => {
      const now = new Date();
      return `Running ${PROJECT} in ${STAGE}/${REGION} (${now.toISOString()})`;
    },
  },
};

exports.request = async (event) => processRequest(event, RESOURCE_MAP);
