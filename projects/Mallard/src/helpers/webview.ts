import { Platform, PixelRatio } from 'react-native'
import { bundles } from 'src/html-bundle-info.json'
import { getFont, FontSizes, FontFamily } from 'src/theme/typography'

export type WebViewPing =
    | {
          type: 'shouldShowHeaderChange'
          shouldShowHeader: boolean
      }
    | {
          type: 'share'
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

interface AltFont {
    showsAsFamily: string
    style: string
    weight: number
}

export const generateAssetsFontCss = ({
    fontFamily,
    variant,
    extension = 'ttf',
}: {
    fontFamily: string
    variant?: AltFont
    extension?: string
}) => {
    const fileName = Platform.select({
        ios: `file:///assets/fonts/${fontFamily}.${extension}`,
        android: `file:///android_asset/fonts/${fontFamily}.${extension}`,
    })

    return css`
        @font-face {
            font-family: '${fontFamily}';
            src: url("${fileName}")
        }
        ${variant &&
            css`@font-face {
                font-family: '${variant.showsAsFamily}';
                font-weight: ${variant.weight};
                font-style: ${variant.style};
                src: url("${fileName}")
            }`}
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
    topPadding,
}: {
    styles: string
    body: string
    topPadding: number
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
        <body style="padding-top:${px(topPadding)}">
            <div id="app" class="app">
                ${body}
            </div>
            <script>
                // Adapted from https://css-tricks.com/styling-based-on-scroll-position/

                const debounce = fn => {
                    let frame
                    return (...params) => {
                        if (frame) cancelAnimationFrame(frame)
                        frame = requestAnimationFrame(() => fn(...params))
                    }
                }

                const TOP_PADDING = ${topPadding}

                let oldScrollY = 0
                let baseScrollY = 0
                window.shouldShowHeader = true
                const THRESHOLD = 30
                const maxScrollY =
                    window.document.body.scrollHeight -
                    window.document.body.clientHeight

                const storeScroll = () => {
                    const scrollY = window.scrollY

                    // FIXME: instead of absolute delta, measure delta to the
                    // last time we changed direction.

                    let distanceSinceTurn = scrollY - baseScrollY
                    const distanceSinceOld = scrollY - oldScrollY

                    if (
                        (distanceSinceOld > 0 && distanceSinceTurn < 0) ||
                        (distanceSinceOld < 0 && distanceSinceTurn > 0)
                    ) {
                        baseScrollY = oldScrollY
                        distanceSinceTurn = distanceSinceOld
                    }
                    oldScrollY = scrollY

                    const shouldNowShowHeader =
                        scrollY < TOP_PADDING ||
                        (distanceSinceTurn < THRESHOLD &&
                            window.shouldShowHeader) ||
                        (distanceSinceTurn < -THRESHOLD &&
                            !window.shouldShowHeader)

                    if (shouldNowShowHeader !== window.shouldShowHeader) {
                        window.shouldShowHeader = shouldNowShowHeader

                        window.ReactNativeWebView.postMessage(
                            JSON.stringify({
                                type: 'shouldShowHeaderChange',
                                shouldShowHeader: window.shouldShowHeader,
                            }),
                        )
                    }
                }

                document.addEventListener('scroll', debounce(storeScroll), {
                    passive: true,
                })
                storeScroll()
            </script>
        </body>
    </html>
`
