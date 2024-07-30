/**
 * Command line script to fetch the required credentials to run an Editions app. Defaults to Mallard
 * Optional Arguments
 * - appRelativePath:  Relative path from the scripts folder to the app that needs it
 * - envBucket: S3 bucket path for the environment variables needed for a dev version of the app
 * - entryBucket: S3 bucket path for the sentry.properties file
 */

const {
    fromIni,
    fromNodeProviderChain,
} = require('@aws-sdk/credential-providers')

const { S3 } = require('@aws-sdk/client-s3')

const path = require('path')
const fs = require('fs')
const argv = require('yargs').argv

const appRelativePath = argv.appRelativePath || '../../Mallard/'
const envBucket = argv.envBucket || 'Mallard/dev/.env'
const sentryBucket = argv.sentryBucket || 'Mallard/dev/sentry.properties'

const AWS_PROFILE = 'mobile'
const ENV_PATH = path.join(__dirname, `${appRelativePath}.env`)
const SENTRY_PATH = path.join(
    __dirname,
    `${appRelativePath}ios/sentry.properties`,
)

const chalkMessage = (message, colour) => {
    ;(async () => {
        try {
            const chalk = await import('chalk')
            switch (colour) {
                case 'green':
                    console.log(chalk.default.green(message))
                case 'red':
                    console.log(chalk.default.red(message))
                case 'yellow':
                    console.log(chalk.default.yellow(message))
            }
        } catch (error) {
            console.error('Error loading module:', error)
        }
    })()
}

const sentryPropertiesFileWrite = (platform, file) => {
    fs.writeFile(
        path.resolve(
            __dirname,
            `${appRelativePath}${platform}/sentry.properties`,
        ),
        file.Body.toString(),
        (e) => {
            if (e) {
                console.error(e)
                process.exit()
            }
            chalkMessage(`${platform} sentry.properties file added`, 'green')
        },
    )
}

const failureMessage = (path, error) => {
    const message = `Unable to update environment variables, check you have \`${AWS_PROFILE}\` credentials and your args are correct.`
    if (fs.existsSync(path)) {
        chalkMessage(message, 'yellow')
    } else {
        console.error(error)
        chalkMessage(message, 'red')
        process.exit(1)
    }
}

const s3 = new S3({
    region: 'eu-west-1',

    credentialProvider: fromNodeProviderChain([
        fromIni({
            profile: AWS_PROFILE,
        }),
    ]),
})

s3.getObject({
    Bucket: 'editions-app-config',
    Key: envBucket,
})
    .then((file) => {
        fs.writeFileSync(ENV_PATH, file.Body)
    })
    .catch((e) => failureMessage(ENV_PATH, e))

s3.getObject({
    Bucket: 'editions-app-config',
    Key: sentryBucket,
})
    .then((file) => {
        sentryPropertiesFileWrite('ios', file)
        sentryPropertiesFileWrite('android', file)
    })
    .catch((e) => failureMessage(SENTRY_PATH, e))
