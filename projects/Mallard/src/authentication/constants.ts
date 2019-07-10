import { Platform } from 'react-native'

// These are hardcoded to code at the moment

const ID_AUTH_URL = 'https://id.code.dev-guardianapis.com/auth'
const MEMBERS_DATA_API_URL = 'https://members-data-api.code.dev-theguardian.com'
// iOS CODE access token
const ID_ACCESS_TOKEN =
    'aefdcf7fcb30a12a54c2dbb08da1d9d6193665f0c4cbe15c1d6d7be9e8933ad5'

const FACEBOOK_CLIENT_ID = '180444840287'
const GOOGLE_CLIENT_ID =
    Platform.OS === 'android'
        ? 'XXX' // TODO: implement
        : '774465807556-kgaj5an4pc4fmr3svp5nfpulekc1rl3n'

export {
    ID_AUTH_URL,
    MEMBERS_DATA_API_URL,
    ID_ACCESS_TOKEN,
    FACEBOOK_CLIENT_ID,
    GOOGLE_CLIENT_ID,
}
