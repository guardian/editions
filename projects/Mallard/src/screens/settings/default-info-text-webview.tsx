import React, { useState } from 'react'
import { PixelRatio, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { maxScreenSize } from 'src/helpers/screen'
import {
    css,
    generateAssetsFontCss,
    makeHtml,
    parsePing,
} from 'src/helpers/webview'
import { WithAppAppearance } from 'src/theme/appearance'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'

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

const DefaultInfoTextWebview = ({ html }: { html: string }) => {
    const [height, setHeight] = useState<number>(maxScreenSize())

    return (
        <WithAppAppearance value={'settings'}>
            <ScrollContainer>
                <View style={{ flex: 1 }}>
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: makeHtml({ styles, body: html }) }}
                        style={{ flex: 1, height }}
                        onMessage={event => {
                            const { scrollHeight } = parsePing(
                                event.nativeEvent.data,
                            )
                            setHeight(scrollHeight)
                        }}
                    />
                </View>
            </ScrollContainer>
        </WithAppAppearance>
    )
}

export { DefaultInfoTextWebview }
