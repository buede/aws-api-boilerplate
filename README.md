# aws-api-boilerplate
Boilerplate for deploying a REST API in AWS using node.js and serverless framework.

## Installation
1. Create a project: `serverless install -u https://github.com/buede/aws-api-boilerplate -n <project name>`
2. Install the dependencies `npm i`

## Managing the API
### Running locally
To start the API in your machine simply run `npm start`, this will deploy the API locally using the serverless offline module.

### Deploy stage
* To dev: `npm run deploy-dev`
* To test: `npm run deploy-test`
* To prod: `npm run deploy-prod`

*Alternatively*
```
serverless deploy --stage <stage>
```

### Remove stage
* From dev: `npm run remove-dev`
* From test: `npm run remove-test`
* From prod: `npm run remove-prod`

*Alternatively*
```
serverless remove --stage <stage>
```

## Testing
To invoke the unit tests located in `/test` simply run `npm test`.

## Recommended
* DynamoDB local https://github.com/99x/serverless-dynamodb-local (recommended for running a local DynamoDB instance) 
* DynamoDB seed https://github.com/arielschvartz/serverless-dynamodb-seed (recommended if your DynamoDB instance should start with some data)