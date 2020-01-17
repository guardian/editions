import React from 'react'
import { DefaultInfoTextWebview } from './default-info-text-webview'

const faqHtml = require('src/constants/settings/faq.json').bodyHtml

const FAQScreen = () => <DefaultInfoTextWebview html={faqHtml} />

FAQScreen.navigationOptions = {
    title: 'FAQ',
}

export { FAQScreen }
