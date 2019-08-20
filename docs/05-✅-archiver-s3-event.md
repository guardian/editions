# Archiver

## Status: Accepted

## Context

The archiver lambda needs to be able to respond to issue published events from tools.

## Decision

For the archiver to react to S3 file created events from the fronts tool.

## Alternatives

The archiver could consume a queue of some form. Or be called directly from the fronts tool.

## Consequences

Whenever a file is added to the publication directory/bucket;
the archiver is ran.
