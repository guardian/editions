import React, { useRef } from 'react'
import { PixelRatio, Linking } from 'react-native'
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
        line-height: 1.4;
    }
    .app {
        font-family: 'GuardianTextEgyptian-Reg';
        padding: ${metrics.vertical}px ${metrics.horizontal}px;
    }
    .app p,
    .app h2 {
        margin: ${metrics.vertical * 2}px 0;
    }
    .app a {
        color: ${color.primary};
        text-decoration-color: ${color.line};
    }
    .app ul {
        margin-left: ${metrics.horizontal * 2}px;
    }
`

const DefaultInfoTextWebview = ({ html }: { html: string }) => {
    const ref = useRef<WebView>()
    return (
        <WithAppAppearance value={'settings'}>
            <WebView
                ref={ref as any}
                originWhitelist={['*']}
                source={{ html: makeHtml({ styles, body: html }), baseUrl: '' }}
                style={{ flex: 1 }}
                useWebKit={false}
                onNavigationStateChange={event => {
                    /**
                     * Open any non-local documents in the external browser
                     * rather than in this webview itself.
                     */
                    if (
                        !event.url.startsWith('file:///') &&
                        ref.current != null
                    ) {
                        ref.current.stopLoading()
                        Linking.openURL(event.url)
                    }
                }}
            />
        </WithAppAppearance>
    )
}

export { DefaultInfoTextWebview }
