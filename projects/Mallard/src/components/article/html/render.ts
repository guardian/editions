import { BlockElement, HTMLElement } from '../../../common'
import { metrics } from '../../../theme/spacing'
import { color } from '../../../theme/color'
import { generateAssetsFontCss, css } from '../../../helpers/webview'

const styles = css`
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
`

export const render = (article: BlockElement[]) => {
    const articleHtml = article
        .filter(el => el.id === 'html')
        .map(el => (el as HTMLElement).html)
        .join('')

    return `
        <html>
        <head>
            <style>
              ${styles}
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
