import React, { useEffect, useState } from 'react'
import { HeaderScreenContainer } from 'src/components/Header/Header'
import { DefaultInfoTextWebview } from './default-info-text-webview'

const CreditsScreen = () => {
    const [htmlData, setHtmlData] = useState('loading...')

    useEffect(() => {
        setHtmlData(require('src/constants/settings/credits.json').bodyHtml)
    }, [])

    return <DefaultInfoTextWebview html={htmlData} />
}

CreditsScreen.navigationOptions = {
    title: 'Credits',
}

// @TODO: Move these titles to the language files
const CreditsScreenWithHeader = () => (
    <HeaderScreenContainer title="Credits" actionLeft={true}>
        <CreditsScreen />
    </HeaderScreenContainer>
)

export { CreditsScreen, CreditsScreenWithHeader }
