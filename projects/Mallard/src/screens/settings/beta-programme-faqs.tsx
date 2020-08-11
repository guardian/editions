import React from 'react'
import { DefaultInfoTextWebview } from './default-info-text-webview'
import { BETA_PROGRAMME_FAQ_HEADER_TITLE } from 'src/helpers/words'
import { html } from 'src/helpers/webview'

const betaProgrammeFAQsHtml = html`
    <h2>Beta Programme FAQs</h2>
`

export const BetaProgrammeFAQsScreen = () => (
    <DefaultInfoTextWebview html={betaProgrammeFAQsHtml} />
)

BetaProgrammeFAQsScreen.navigationOptions = {
    title: BETA_PROGRAMME_FAQ_HEADER_TITLE,
}
