import React from 'react'
import { HeaderScreenContainer } from 'src/components/Header/Header'
import { DefaultInfoTextWebview } from './default-info-text-webview'

const termsAndConditionsHtml = require('src/constants/settings/terms-of-service.json')
    .bodyHtml

const TermsAndConditionsScreen = () => (
    <DefaultInfoTextWebview html={termsAndConditionsHtml} />
)

const TermsAndConditionsScreenWithHeader = () => (
    <HeaderScreenContainer title="Terms &amp; Conditions" actionLeft={true}>
        <TermsAndConditionsScreen />
    </HeaderScreenContainer>
)

TermsAndConditionsScreen.navigationOptions = {
    title: 'Terms & Conditions',
}

export { TermsAndConditionsScreen, TermsAndConditionsScreenWithHeader }
