/**
 * Command line script to fetch the required credentials to run an Editions app. Defaults to Mallard
 * Optional Arguments
 * - appRelativePath:  Relative path from the scripts folder to the app that needs it
 * - envBucket: S3 bucket path for the environment variables needed for a dev version of the app
 * - entryBucket: S3 bucket path for the sentry.properties file
 */

const AWS = require('aws-sdk')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const argv = require('yargs').argv

const appRelativePath = argv.appRelativePath || '../../../Mallard/'
const envBucket = argv.envBucket || 'Mallard/dev/.env'
const sentryBucket = argv.sentryBucket || 'Mallard/dev/sentry.properties'

const AWS_PROFILE = 'mobile'
const ENV_PATH = path.join(__dirname, `${appRelativePath}.env`)
const SENTRY_PATH = path.join(
    __dirname,
    `${appRelativePath}ios/sentry.properties`,
)

const sentryPropertiesFileWrite = (platform, file) => {
    fs.writeFile(
        path.resolve(
            __dirname,
            `${appRelativePath}${platform}/sentry.properties`,
        ),
        file.Body.toString(),
        e => {
            if (e) {
                console.error(e)
                process.exit()
            }
            console.log(chalk.green(`${platform} sentry.properties file added`))
        },
    )
}

const failureMessage = (path, error) => {
    const message = `Unable to update environment variables, check you have \`${AWS_PROFILE}\` credentials and your args are correct.`
    if (fs.existsSync(path)) {
        console.log(chalk.yellow(message))
    } else {
        console.error(error)
        console.log(chalk.red(message))
        process.exit(1)
    }
}

const s3 = new AWS.S3({
    region: 'eu-west-1',
    credentialProvider: new AWS.CredentialProviderChain([
        new AWS.SharedIniFileCredentials({
            profile: AWS_PROFILE,
        }),
    ]),
})

s3.getObject({
    Bucket: 'editions-app-config',
    Key: envBucket,
})
    .promise()
    .then(file => {
        fs.writeFileSync(ENV_PATH, file.Body)
    })
    .catch((e) => failureMessage(ENV_PATH, e))

s3.getObject({
    Bucket: 'editions-app-config',
    Key: sentryBucket,
})
    .promise()
    .then(file => {
        sentryPropertiesFileWrite('ios', file)
        sentryPropertiesFileWrite('android', file)
    })
    .catch((e) => failureMessage(SENTRY_PATH, e))
