import React from 'react'
import { PixelRatio } from 'react-native'
import { WebView } from 'react-native-webview'
import { css, generateAssetsFontCss, makeHtml } from 'src/helpers/webview'
import { WithAppAppearance } from 'src/theme/appearance'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'

const styles: string = css`
    ${generateAssetsFontCss({ fontFamily: 'GuardianTextEgyptian-Reg' })}
    * {
        margin: 0;
        padding: 0;
    }
    :root {
        font-size: ${17 * PixelRatio.getFontScale()}px;
        line-height; 1.4;
    }
    .app {
        font-family: 'GuardianTextEgyptian-Reg';
        padding: ${metrics.vertical}px ${metrics.horizontal}px;
    }
    .app p, .app h2 {
        margin: ${metrics.vertical * 2}px 0;
    }
    .app a {
        color: ${color.primary};
        text-decoration-color: ${color.line};
    }
    .app ul {
        margin-left: ${metrics.horizontal}px;
    }
`

const DefaultInfoTextWebview = ({ html }: { html: string }) => {
    return (
        <WithAppAppearance value={'settings'}>
            <WebView
                originWhitelist={['*']}
                source={{ html: makeHtml({ styles, body: html }) }}
                style={{ flex: 1 }}
            />
        </WithAppAppearance>
    )
}

export { DefaultInfoTextWebview }
