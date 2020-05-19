import appleAuth, {
    AppleAuthRequestOperation,
    AppleAuthRequestScope,
    AppleAuthCredentialState,
    RNAppleAuth,
} from '@invertase/react-native-apple-authentication'
import invariant from 'invariant'

import { AppleCreds } from 'src/authentication/authorizers/IdentityAuthorizer'

const mapCredentials = (
    appleCredentials: RNAppleAuth.AppleAuthRequestResponse,
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

export const appleNativeAuth = async (): Promise<AppleCreds> => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
            AppleAuthRequestScope.EMAIL,
            AppleAuthRequestScope.FULL_NAME,
        ],
    })
    return mapCredentials(appleAuthRequestResponse)
    // // get current authentication state for user
    // const credentialState = await appleAuth.getCredentialStateForUser(
    //     appleAuthRequestResponse.user,
    // )
    // // use credentialState response to ensure the user is authenticated
    // if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
    //     return mapCredentials(appleAuthRequestResponse)
    // } else {
    //     invariant('failed')
    // }
}
