import {
    AppleAuthenticationCredential,
    AppleAuthenticationScope,
    signInAsync,
} from 'expo-apple-authentication'

import { AppleCreds } from 'src/authentication/authorizers/IdentityAuthorizer'

const mapCredentials = (
    appleCredentials: AppleAuthenticationCredential,
): AppleCreds => {
    const { identityToken, authorizationCode, fullName } = appleCredentials
    const givenName = fullName ? fullName.givenName : ''
    const familyName = fullName ? fullName.familyName : ''

    return {
        authorizationCode: authorizationCode || '',
        givenName: givenName || '',
        familyName: familyName || '',
        idToken: identityToken || '',
    }
}

export const appleAuth = (): Promise<AppleCreds> => {
    return signInAsync({
        requestedScopes: [
            AppleAuthenticationScope.FULL_NAME,
            AppleAuthenticationScope.EMAIL,
        ],
    }).then(mapCredentials)
}
