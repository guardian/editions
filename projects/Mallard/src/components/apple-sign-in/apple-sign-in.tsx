import * as React from 'react'
import * as AppleAuthentication from 'expo-apple-authentication'

const AppleSignIn: React.FC = () => {
    return (
        <AppleAuthentication.AppleAuthenticationButton
            buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={5}
            style={{ width: 200, height: 44 }}
            onPress={async () => {
                try {
                    const credential = await AppleAuthentication.signInAsync({
                        requestedScopes: [
                            AppleAuthentication.AppleAuthenticationScope
                                .FULL_NAME,
                            AppleAuthentication.AppleAuthenticationScope.EMAIL,
                        ],
                    })
                    console.log(credential)
                    // signed in
                } catch (e) {
                    if (e.code === 'ERR_CANCELED') {
                        // handle that the user canceled the sign-in flow
                    } else {
                        // handle other errors
                    }
                }
            }}
        />
    )
}

export default AppleSignIn
