import { BlockElement, HTMLElement } from '../../../common'
import { Platform } from 'react-native'

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
                font-family: 'GuardianTextEgyptian-Reg'
              }
            </style>
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
            ${articleHtml}
            <script>
                window.requestAnimationFrame(function() {
                    window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight)
                })
            </script>
        </body>
        </html>
    `
}
