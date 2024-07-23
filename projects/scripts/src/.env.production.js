const path = require('path')
const fs = require('fs')
const argv = require('yargs').argv

const NEWLINE = '\n'
const removeWhiteSpace = s => s.trim()
const isNonEmpty = s => s

const appRelativePath = argv.appRelativePath || './'

/**
 *
 * `key` is expected to be in the format:
 * `MY_ENV_VAR`
 * where `value` will be read from the environment variable `process.env.MY_ENV_VAR` and then
 * set as `MY_ENV_VAR=value` in the file
 *
 * or it can be in the format:
 * `test.var=MY_ENV_VAR`
 * where the `value` will be read from `process.env.MY_ENV_VAR` and set as `test.var=value`
 * in the file
 *
 * This is useful for when config files require chars that cannot be used in environment variables
 * such as periods. Or when the same env var needs to be written to two different properties
 */

const getValueFromEnvironment = key => {
    let [writeKey, readKey = writeKey] = key.split('=')
    const value = process.env[readKey]
    if (typeof value === 'undefined')
        throw new Error(`Could not find ${readKey} in environment`)
    return `${writeKey}=${value}`
}
const writeToFile = (relativePaths, data) =>
    relativePaths.forEach(relativePath =>
        fs.writeFileSync(path.join(process.cwd(), relativePath), data),
    )

const writeEnvVarsToFiles = (...paths) => strings =>
    writeToFile(
        paths,
        strings[0]
            .split(NEWLINE)
            .map(removeWhiteSpace)
            .filter(isNonEmpty)
            .map(getValueFromEnvironment)
            .join(NEWLINE),
    )

writeEnvVarsToFiles(`${appRelativePath}.env`)`
ID_ACCESS_TOKEN
ID_API_URL
MEMBERS_DATA_API_URL
SENTRY_DSN_URL
ITUNES_CONNECT_SHARED_SECRET
USE_SANDBOX_IAP
ANDROID_RELEASE_STREAM
LOGGING_API_KEY
`

writeEnvVarsToFiles(
    `${appRelativePath}android/sentry.properties`,
    `${appRelativePath}ios/sentry.properties`,
)`
defaults.url=SENTRY_DEFAULTS_URL
defaults.org=SENTRY_DEFAULTS_ORG
defaults.project=SENTRY_DEFAULTS_PROJECT
auth.token=SENTRY_AUTH_TOKEN
cli.executable=SENTRY_CLI_EXECUTABLE
`
