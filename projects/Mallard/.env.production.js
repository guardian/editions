const { writeRequiredEnvVars } = require('./scripts/helpers/helpers.js')

writeRequiredEnvVars`
ID_ACCESS_TOKEN
ID_API_URL
MEMBERS_DATA_API_URL
SENTRY_DSN_URL
`
