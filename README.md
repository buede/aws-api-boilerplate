# aws-api-boilerplate
[![Build Status](https://travis-ci.com/buede/aws-api-boilerplate.svg?branch=master)](https://travis-ci.com/buede/aws-api-boilerplate)
[![codecov](https://codecov.io/gh/buede/aws-api-boilerplate/branch/master/graph/badge.svg?token=MS2RV48S07)](https://codecov.io/gh/buede/aws-api-boilerplate)
[![Maintainability](https://api.codeclimate.com/v1/badges/74812ddbb7e2d9054f20/maintainability)](https://codeclimate.com/github/buede/aws-api-boilerplate/maintainability)

Boilerplate for deploying a REST API in AWS using node.js and serverless framework.

Based on [serverless-es6-boilerplate](https://github.com/artoliukkonen/serverless-es6-boilerplate).

## Requirements
* [Serverless](https://github.com/serverless/serverless)
* [Node.js 12.x](https://nodejs.org/)

## Installation
1. Create a project using `serverless install -u https://github.com/buede/aws-api-boilerplate -n <project name>`
2. Open the newly created directory for the project using `cd <project name>`
3. Install the dependencies with `npm i`

## Adding endpoints
1. Create a new handler file (like `handler-user.js`)
2. Import the function `processRequest` from the module `handler.js`
3. Create a resource map object using the format:
   ```
   const RESOURCE_MAP = {
     '/<URL path>': {
       <http request method>: <function or function reference>,
     },
   }
   ```
4. Export a default request function that takes an `event` object as parameter and returns the execution of the function `processRequest` (imported from the module `handler.js`), passing the `event` object and the resource map as parameters like in the example below:
   ```
   exports.request = async (event) => processRequest(event, RESOURCE_MAP);
   ```
5. Add the function to the `serverless.yml` file under the tag `functions` (don't forget to keep `method: any` otherwise the call will be filtered before reaching the handler):
   ```
   functions:
     <function name>:
       handler: <path to the handler file>.<request function>
       events:
         - http:
           path: <URL path>
           method: any
   ```
Important note: the function executed by the newly created handler can either return a custom response (`src/model/Response.js`) if something other than HTTP 200 is needed or then the content directly.

## Managing the API
### Running locally
To start the API in your machine simply run `npm start`, this will deploy the API locally using the serverless offline module.

### Deploy stage
* To dev: `npm run deploy-dev`
* To test: `npm run deploy-test`
* To prod: `npm run deploy-prod`

*Alternatively:* `serverless deploy --stage <stage>`

### Remove stage
* From dev: `npm run remove-dev`
* From test: `npm run remove-test`
* From prod: `npm run remove-prod`

*Alternatively:* `serverless remove --stage <stage>`

## Testing
To invoke the unit tests located in `/test` simply run `npm test`.

## Recommended packages
* [serverless-dynamodb-local](https://github.com/99x/serverless-dynamodb-local) (recommended for running a local DynamoDB instance) 
* [serverless-dynamodb-seed](https://github.com/arielschvartz/serverless-dynamodb-seed) (recommended if your DynamoDB instance should start with some data)