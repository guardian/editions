import React from 'react'
import { DefaultInfoTextWebview } from './default-info-text-webview'
import { LoginHeader } from 'src/components/login/login-layout'
import { PRIVACY_POLICY_HEADER_TITLE } from 'src/helpers/words'
import { NavigationInjectedProps } from 'react-navigation'
import { routeNames } from 'src/navigation/routes'

const privacyPolicyHtml = require('src/constants/settings/privacy-policy.json')
    .bodyHtml

const PrivacyPolicyScreen = () => (
    <DefaultInfoTextWebview html={privacyPolicyHtml} />
)

PrivacyPolicyScreen.navigationOptions = {
    title: PRIVACY_POLICY_HEADER_TITLE,
}

const PrivacyPolicyScreenForOnboarding = ({
    navigation,
}: NavigationInjectedProps) => (
    <>
        <LoginHeader onDismiss={() => navigation.goBack()}>
            {PRIVACY_POLICY_HEADER_TITLE}
        </LoginHeader>
        <DefaultInfoTextWebview html={privacyPolicyHtml} />
    </>
)

export { PrivacyPolicyScreen, PrivacyPolicyScreenForOnboarding }
