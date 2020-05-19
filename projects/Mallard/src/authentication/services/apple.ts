import appleAuth, {
    AppleAuthRequestOperation,
    AppleAuthRequestScope,
    AppleAuthCredentialState,
    RNAppleAuth,
} from '@invertase/react-native-apple-authentication'
import invariant from 'invariant'

import { AppleCreds } from 'src/authentication/authorizers/IdentityAuthorizer'
import { TokenKind } from 'graphql'

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

export const appleNativeAuth = async (
    validatorString: string,
): Promise<AppleCreds> => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
        state: validatorString,
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
            AppleAuthRequestScope.EMAIL,
            AppleAuthRequestScope.FULL_NAME,
        ],
    })

    return mapCredentials(appleAuthRequestResponse)
}
