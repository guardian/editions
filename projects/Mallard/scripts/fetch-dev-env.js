const AWS = require('aws-sdk')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk').default

const AWS_PROFILE = 'frontend'
const ENV_PATH = path.join(__dirname, '../.env')

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
