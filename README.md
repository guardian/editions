# Editions

The Guardian Editions app includes the UK Daily edition, Australia Weekend and other special editions. The app is available on Android and iOS phones and tablets.

## Setup

If you're a guardian staff member and haven't already it's worth running the [strap](https://gu-strap.herokuapp.com/) script which installs a [load of useful stuff](https://github.com/guardian/homebrew-devtools/blob/master/Casks/gu-base.rb) including VSCode - the editor used by the editions team.

The project uses [nvm](https://github.com/nvm-sh/nvm) so this will need to be installed before if it's not already. Do not install it using brew.

Once nvm is installed run `nvm use`.

Run `make install`, this will install the dependencies for all sub-projects.

You will need `mobile` and `cmsFronts.s3Read` credentials loaded. (NOTE: At present, if you have [default] credentials set in ~/.aws/credentials) the app won't build - best to delete these before continuing)

## App setup

To run the client-side app, cd into `projects/Mallard` and check out it's [README](https://github.com/guardian/editions/tree/master/projects/Mallard).

## Subprojects

The project is split into several sub projects, located in the projects directory. Each of these contains a `package.json` and `README.md` file.

## Installing, building, testing and linting

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

To exclude one or more projects, set the `EXCLUDE` environment variable to the names of the project seperated by spaces. This is used on CI to produce backend only builds.

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

## Deployment

### backend, archiver and aws

These all deploy in one go. The default github branch is `master` which automatically triggers CI deployment once someone merges code changes into it. If you need to deploy from a different branch (i.e. from a PR branch) first make sure it builds ok in teamcity job (Editions > Build) and make sure you choose the right branch before you press the `run` button in teamcity. Once the build completes successfully, make a note of the build number, go to [riffraff](https://riffraff.gutools.co.uk), type/find the `editions` project and choose the build number you noted from teamcity. As usual, you can choose CODE or PROD to deploy depending on your needs.

## Uploading iOS internal beta to testflight

There is a scheduled github [action](https://github.com/guardian/editions/actions?query=workflow%3Ascheduled-ios-beta) which runs everyday at 3pm and uploads an internal beta build to testflight.

To **manually** upload an internal beta

1. Go to the scheduled github [action](https://github.com/guardian/editions/actions?query=workflow%3Ascheduled-ios-beta)
2. Select Run Worflow
3. Select which branch you would like to use the workflow from

## Complete Process Flow

1. Editors open the Fronts tool and collate the content for an issue.
1. Editors click 'Proof'
1. The list of articles forming the content is written to a json file in a specific s3 bucket
1. A policy on that bucket notifies a function running in AWS Lambda service
1. That function (and a bunch of others that follow it) produces the entire issue content and write it to a different s3 bucket ('proofed')
1. The download location of that content is added to an index file in that bucket
1. Editions click 'Publish' when it is ready
1. That triggers another step function in 'archiver' which copy all the generated content in previous step to a different s3 ('published')
1. The app is opened and fetches the index file
1. The user chooses which issues they would like to have
1. The app fetches those issues
1. The user reads the e-paper, there is applause, fireworks, etc.

## Notification Flow

-   Fronts tool (aka facia-tool)
    -   owned by the `cmsFronts` account, `facia-$STAGE` stack

writes to

-   bucket `published-editions-$STAGE`
    -   owned by the `cmsFronts` account, `facia-db-$STAGE` stack

which notifies

-   the lambda specified in the `mobile` account
    -   Currently this is:
        -   `arn:aws:lambda:eu-west-1:201359054765:function:editions-proof-archiver-s3-event-listener-CODE`
        -   `arn:aws:lambda:eu-west-1:201359054765:function:editions-proof-archiver-s3-event-listener-PROD`

which kicks off the step function, which writes to

-   the s3 bucket `editions-proofed-$STAGE`

    -   owned by the `mobile` account

until the complete issue is ready to publish, when it is copied to

-   the s3 bucket `editions-published-$STAGE`
    -   owned by the `mobile` account
