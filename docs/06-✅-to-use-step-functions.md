# Step Functions

## Status: Accepted

## Context

The archiving process is time consuming and consists of many stages.

## Decision

For the archiving process to be run as an amazon step function so we can break the process down into component stages.

This will allow anyone supporting the system to immediately find what broke in case something goes wrong.

This will also allow the publication process to fire the notification at the desired time.


## Alternatives

Could just stay as one lambda and use a queue or cron job.

## Consequences

Logic split between step function defintion and lambdas.
