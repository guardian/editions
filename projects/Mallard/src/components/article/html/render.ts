import { BlockElement, HTMLElement } from '../../../common'
import { Platform } from 'react-native'
import { metrics } from '../../../theme/spacing'
import { color } from '../../../theme/color'

type fontFormats = 'ttf' | 'otf'

export const generateAssetsFontCss = (
    fontFamily: string,
    fileFormat: fontFormats = 'ttf',
) => {
    const fileName = Platform.select({
        ios: `file:///assets/fonts/${fontFamily}.${fileFormat}`,
        android: `file:///android_asset/fonts/${fontFamily}.${fileFormat}`,
    })

    return `@font-face {
		font-family: '${fontFamily}';
		src: url("${fileName}")
}`
}

export const render = (article: BlockElement[]) => {
    const articleHtml = article
        .filter(el => el.id === 'html')
        .map(el => (el as HTMLElement).html)
        .join('')

    return `
        <html>
        <head>
            <style>
              ${generateAssetsFontCss('GuardianTextEgyptian-Reg')}
              * {
                margin: 0;
                padding: 0;
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
            </style>
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
            <div id="app">
                ${articleHtml}
            </div>
            <script>
                window.requestAnimationFrame(function() {
                    window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight)
                })
            </script>
        </body>
        </html>
    `
}
