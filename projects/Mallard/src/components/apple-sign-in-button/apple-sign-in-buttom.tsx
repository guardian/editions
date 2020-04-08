import React from 'react'
import {
    AppleAuthenticationButton,
    AppleAuthenticationButtonStyle,
    AppleAuthenticationButtonType,
    AppleAuthenticationScope,
    signInAsync,
} from 'expo-apple-authentication'

const buttonStyles = { width: 200, height: 44 }

function AppleSignInButton() {
    async function asyncHandleOnPress() {
        try {
            const credential = await signInAsync({
                requestedScopes: [
                    AppleAuthenticationScope.FULL_NAME,
                    AppleAuthenticationScope.EMAIL,
                ],
            })

            console.log('debug', credential)
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
