# editions

The future Daily Edition app.

## Setup

The project uses [nvm](https://github.com/nvm-sh/nvm) so this will need to be installed before if it's not already. Do not install it using brew.

Once nvm is installed run `nvm use`.

Run `make install`, this will install the dependencies for all sub-projects.

You will need `frontend` and `cmsFronts` credentials loaded.

## App setup

To run the client-side app, cd into `projects/Mallard` and check out it's [README](https://github.com/guardian/editions/tree/master/projects/Mallard).

## Subprojects

### [Mallard](https://github.com/guardian/editions/tree/master/projects/Mallard)

This is the mobile app for downloading and viewing Editions. It runs on Android and iOS via react-native.

### [backend](https://github.com/guardian/editions/tree/master/projects/backend)

This is the lambda which turns CAPI, fronts data and images into a format the app can use, it can be run as a local http service for development.

### [archiver](https://github.com/guardian/editions/tree/master/projects/archiver)

This is a collection of lambdas which form a step function which uses the backend to generate the contents of the S3 buckets which the app reads from.

### [aws](https://github.com/guardian/editions/tree/master/projects/aws)

This is the Amazon architecture for the backend and archiver, expressed as cdk.

### [Apps](https://github.com/guardian/editions/tree/master/projects/Apps)

This contains `common` which is the code shared between app and backends and `crosswords` which is the crossword.

## Developer tooling

The project is split into several sub projects, located in the projects directory. Each of these contains a `package.json` and `README.md` file.

Make targets are used to build, lint, test and install dependencies. These can either run against one, some, or all of the subprojects.

-   `make install` install node dependencies with yarn
-   `make validate` run lint
-   `make fix` run lint with autofix
-   `make test` run unit tests
-   `make build` compile
-   `make clean` delete node modules and other build related things
-   `make list`

To run a make target against one project only, follow it with `-` and the project name:

`make install-Mallard`

## Deployment

### backend, archiver and aws

These are deployed using [riffraff](https://riffraff.gutools.co.uk) as `editions`.
