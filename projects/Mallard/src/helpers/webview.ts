import { Platform, PixelRatio } from 'react-native'
import { bundles } from 'src/html-bundle-info.json'
import { getFont, FontSizes, FontFamily } from 'src/theme/typography'

export interface WebViewPing {
    scrollHeight: number
    isAtTop: boolean
}

/*
this tricks vs code into thinking
we are using emotion & lit-html
and gives us syntax colors
*/
const passthrough = (
    literals: TemplateStringsArray,
    ...placeholders: any[]
): string =>
    literals.reduce((acc, literal, i) => {
        if (placeholders[i]) {
            return acc + literal + placeholders[i]
        }
        return acc + literal
    }, '')

export const css = passthrough
export const html = passthrough

export const px = (value: string | number) => `${value}px`

export const getScaledFont = <F extends FontFamily>(
    family: F,
    level: FontSizes<F>,
) => {
    const font = getFont(family, level)
    return {
        ...font,
        lineHeight: font.lineHeight * PixelRatio.getFontScale(),
        fontSize: font.fontSize * PixelRatio.getFontScale(),
    }
}

export const getScaledFontCss = <F extends FontFamily>(
    family: F,
    level: FontSizes<F>,
) => {
    const font = getScaledFont(family, level)
    return css`
        font-size: ${px(font.fontSize)};
        line-height: ${px(font.lineHeight)};
    `
}

export const generateAssetsFontCss = (fontFamily: string, fontWeight = 400) => {
    const fileName = Platform.select({
        ios: `file:///assets/fonts/${fontFamily}.ttf`,
        android: `file:///android_asset/fonts/${fontFamily}.ttf`,
    })

    return css`
        @font-face {
            font-family: '${fontFamily}';
            font-weight: ${fontWeight};
            src: url("${fileName}")
        }
    `
}

export const getBundleUri = (
    key: keyof typeof bundles,
    use?: 'dev' | 'prod',
): string => {
    const uris = {
        dev: 'http://localhost:' + bundles[key].watchPort,
        prod:
            (Platform.OS === 'android' ? 'file:///android_asset/' : '') +
            bundles[key].key +
            '.bundle/index.html',
    }
    if (!use) {
        return __DEV__ ? uris.dev : uris.prod
    }
    return uris[use]
}

export const parsePing = (data: string) => JSON.parse(data) as WebViewPing

/* makes some HTML and posts the height back */
export const makeHtml = ({
    styles,
    body,
}: {
    styles: string
    body: string
}) => html`
    <html>
        <head>
            <style>
                ${styles}
            </style>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
        </head>
        <body>
            <div id="app">
                ${body}
            </div>
            <script>
                const submitHeight = function() {
                    window.ReactNativeWebView.postMessage(
                        JSON.stringify({
                            scrollHeight: document.documentElement.scrollHeight,
                            isAtTop: window.scrollY < 10,
                        }),
                    )
                }

                window.setInterval(function() {
                    submitHeight()
                }, 500)
                window.addEventListener('scroll', function() {
                    submitHeight()
                })
                submitHeight()
            </script>
        </body>
    </html>
`
