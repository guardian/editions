import React from 'react'
import {
    AppleAuthenticationCredential,
    AppleAuthenticationButton,
    AppleAuthenticationButtonStyle,
    AppleAuthenticationButtonType,
    AppleAuthenticationScope,
    signInAsync,
} from 'expo-apple-authentication'

const buttonStyles = { width: 200, height: 44 }

interface GuardianCredentials {
    authorizationCode: string | null
    idToken: string | null
    givenName: string | null
    familyName: string | null
}

function mapCredentials(
    appleCredentials: AppleAuthenticationCredential,
): GuardianCredentials {
    const { identityToken, authorizationCode, fullName } = appleCredentials
    const givenName = fullName ? fullName.givenName : null
    const familyName = fullName ? fullName.familyName : null

    return {
        authorizationCode,
        givenName: givenName,
        familyName: familyName,
        idToken: identityToken,
    }
}

interface AppleSignInButtonProps {
    onClick: (credentials: GuardianCredentials) => void
}

function AppleSignInButton(props: AppleSignInButtonProps) {
    const { onClick } = props

    async function asyncHandleOnPress() {
        try {
            const appleCredentials = await signInAsync({
                requestedScopes: [
                    AppleAuthenticationScope.FULL_NAME,
                    AppleAuthenticationScope.EMAIL,
                ],
            })

            const guardianCredentials = mapCredentials(appleCredentials)
            onClick(guardianCredentials)
        } catch (e) {
            if (e.code === 'ERR_CANCLED') {
                // handle that the user canceled the sign-in flow
            } else {
                // handle other errors
            }
        }
    }

    return (
        <AppleAuthenticationButton
            buttonType={AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={5}
            style={buttonStyles}
            onPress={() => asyncHandleOnPress()}
        />
    )
}

export default AppleSignInButton
