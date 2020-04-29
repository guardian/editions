# Editions Logging

This is a very simple service used for client side logging from the editions app. It is made up of an edge optimised
API gateway endpoint and a lambda function. The only interesting endpoint is /log, which will log the body of POST requests to cloudwatch. These logs will then get picked up by the [cloudwatch log management](https://github.com/guardian/cloudwatch-logs-management) service and pushed into the guardian ELK stack (https://logs.gutools.co.uk).

You can find the infrastructure in the logging-stack cdk file. This service is deployed as a separate stack.

## Installling

Follow the steps in the project [readme](https://github.com/guardian/editions/blob/master/README.md).

## Running locally

Run `yarn start`. The app should then be accessible on port 3132.

## Deployment

Builds take place in teamcity [here](https://teamcity.gutools.co.uk/buildConfiguration/Editions_Build?branch=&buildTypeTab=overview&mode=builds).

To release changes, deploy the `editions` project in riffraff.
