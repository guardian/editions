import React from 'react'
import {
    AppleAuthenticationButton,
    AppleAuthenticationButtonStyle,
    AppleAuthenticationButtonType,
    AppleAuthenticationScope,
    AppleAuthenticationFullName,
    signInAsync,
} from 'expo-apple-authentication'

const buttonStyles = { width: 200, height: 44 }

async function asyncAppleGuardianAuth(
    authorizationCode: string | null,
    idToken: string | null,
    name: AppleAuthenticationFullName | null
) {
    if (!authorizationCode || !idToken || !name)
        return console.error('error message')

    const url = 'https://id.guardianapis.com/auth'

    const options = {
        method: 'POST',
        body: {
            authorizationCode,
            idToken,
            givenName: name.givenName,
            familyName: name.familyName,
        },
    }

    const response = await fetch(url, options)

    return response.json()
}

function AppleSignInButton() {
    async function asyncHandleOnPress() {
        try {
            const credential = await signInAsync({
                requestedScopes: [
                    AppleAuthenticationScope.FULL_NAME,
                    AppleAuthenticationScope.EMAIL,
                ],
            })

            console.log('debug apple handshake', credential)
            const guardianHandshake = await asyncAppleGuardianAuth(
                credential.authorizationCode,
                credential.identityToken,
                credential.fullName,
            )

            console.log('debug guardian handshake', guardianHandshake)
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
