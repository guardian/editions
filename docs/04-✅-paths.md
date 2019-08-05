# Issue Paths

## Status: ?

## Context

The editions lambda needs to be able to identify specific versions of an issue.

## Decision

To have two deployments of the backend, one for previewing, and a second for published issues.

The published issues deployment will replace the issueid path parameter with source/issueid.

`source` will identify which file in the published bucket will be retreived to form the issue on.

## Alternatives

The issue could be identified with a get parameter and they could both run in the same deployment.

## Consequences

The published issues lambda will not be directly callable from the app.
