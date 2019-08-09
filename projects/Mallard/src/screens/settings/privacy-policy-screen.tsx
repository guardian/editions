import React from 'react'
import { DefaultInfoTextWebview } from './default-info-text-webview'

const privacyPolicyHtml = require('src/constants/settings/privacy-policy.json')
    .bodyHtml

const PrivacyPolicyScreen = () => (
    <DefaultInfoTextWebview html={privacyPolicyHtml} />
)

export { PrivacyPolicyScreen }
