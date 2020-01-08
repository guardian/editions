import React from 'react'
import { DefaultInfoTextWebview } from './default-info-text-webview'

const termsAndConditionsHtml = require('src/constants/settings/credits.json')
    .bodyHtml

const CreditsScreen = () => (
    <DefaultInfoTextWebview html={termsAndConditionsHtml} />
)

CreditsScreen.navigationOptions = {
    title: 'Credits',
}

export { CreditsScreen }
