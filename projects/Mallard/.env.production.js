const { writeEnvVarsToFiles } = require('./scripts/helpers/helpers.js')

writeEnvVarsToFiles('.env')`
ID_ACCESS_TOKEN
ID_API_URL
MEMBERS_DATA_API_URL
SENTRY_DSN_URL
ITUNES_CONNECT_SHARED_SECRET
USE_SANDBOX_IAP
ANDROID_RELEASE_STREAM
`

writeEnvVarsToFiles('android/sentry.properties', 'ios/sentry.properties')`
defaults.url=SENTRY_DEFAULTS_URL
defaults.org=SENTRY_DEFAULTS_ORG
defaults.project=SENTRY_DEFAULTS_PROJECT
auth.token=SENTRY_AUTH_TOKEN
cli.executable=SENTRY_CLI_EXECUTABLE
`
