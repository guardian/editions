import React from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import { WebView } from 'react-native-webview'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { WithAppAppearance } from 'src/theme/appearance'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { generateAssetsFontCss, css, makeHtml } from 'src/helpers/webview'
import { PixelRatio } from 'react-native'

const styles: string = css`
    ${generateAssetsFontCss('GuardianTextEgyptian-Reg')}
    * {
        margin: 0;
        padding: 0;
    }
    :root {
        font-size: ${17 * PixelRatio.getFontScale()}px;
        line-height; 1.4;
    }
    #app {
        font-family: 'GuardianTextEgyptian-Reg';
        padding: ${metrics.vertical}px ${metrics.horizontal}px;
    }
    #app p {
        margin-bottom: ${metrics.vertical * 2}px;
    }
    #app a {
        color: ${color.primary};
        text-decoration-color: ${color.line};
    }
`

const webviewStyles = StyleSheet.create({ flex: { flex: 1, minHeight: 600 } })

const DefaultInfoTextWebview = ({ html }: { html: string }) => (
    <WithAppAppearance value={'settings'}>
        <ScrollContainer>
            <View style={{ flex: 1 }}>
                <WebView
                    originWhitelist={['*']}
                    source={{ html: makeHtml({ styles, html }) }}
                    style={webviewStyles.flex}
                />
            </View>
        </ScrollContainer>
    </WithAppAppearance>
)

export { DefaultInfoTextWebview }
