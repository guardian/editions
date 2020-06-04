import appleAuth, {
    AppleAuthRequestOperation,
    AppleAuthRequestScope,
    RNAppleAuth,
} from '@invertase/react-native-apple-authentication'

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
