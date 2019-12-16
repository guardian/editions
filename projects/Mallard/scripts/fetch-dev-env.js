const AWS = require('aws-sdk')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

const AWS_PROFILE = 'frontend'
const ENV_PATH = path.join(__dirname, '../.env')

const sentryPropertiesFileWrite = (platform, file) => {
    fs.writeFile(
        path.resolve(__dirname, `../${platform}/sentry.properties`),
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

const s3 = new AWS.S3({
    region: 'eu-west-1',
    credentialProvider: new AWS.CredentialProviderChain([
        new AWS.SharedIniFileCredentials({
            profile: AWS_PROFILE,
        }),
    ]),
})

s3.getObject({
    Bucket: 'editions-config',
    Key: 'Mallard/dev/.env',
})
    .promise()
    .then(file => {
        fs.writeFileSync(ENV_PATH, file.Body)
    })
    .catch(() => {
        /**
         * if the file exists already then don't worry too much
         * otherwise we want to exit
         */
        if (fs.existsSync(ENV_PATH)) {
            console.log(
                chalk.yellow(
                    `Unable to update environment variables, check you have \`${AWS_PROFILE}\` credentials.`,
                ),
            )
        } else {
            console.log(
                chalk.red(
                    `Unable to fetch environment variables, check you have \`${AWS_PROFILE}\` credentials`,
                ),
            )
            process.exit(1)
        }
    })

s3.getObject({
    Bucket: 'editions-config',
    Key: 'Mallard/dev/sentry.properties',
})
    .promise()
    .then(file => {
        sentryPropertiesFileWrite('ios', file)
        sentryPropertiesFileWrite('android', file)
    })
