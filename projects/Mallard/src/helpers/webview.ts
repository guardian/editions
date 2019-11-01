import { Platform, PixelRatio } from 'react-native'
import { bundles } from 'src/html-bundle-info.json'
import { getFont, FontSizes, FontFamily } from 'src/theme/typography'

export type WebViewPing =
    | {
          scrollHeight: number
          isAtTop: boolean
          type: undefined
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
            <div id="app" class="app">
                ${body}
            </div>
            <div id="top-shadow" />
            <script>
                // From https://css-tricks.com/styling-based-on-scroll-position/

                const debounce = fn => {
                    // This holds the requestAnimationFrame reference, so we can cancel it if we wish
                    let frame

                    // The debounce function returns a new function that can receive a variable number of arguments
                    return (...params) => {
                        // If the frame variable has been defined, clear it now, and queue for next frame
                        if (frame) {
                            cancelAnimationFrame(frame)
                        }

                        // Queue our function call for the next frame
                        frame = requestAnimationFrame(() => {
                            // Call our function and pass any params we received
                            fn(...params)
                        })
                    }
                }

                // Reads out the scroll position and stores it in the data attribute
                // so we can use it in our stylesheets
                const storeScroll = () => {
                    if (window.scrollY === 0) {
                        document.documentElement.classList.remove('scrolled')
                    } else {
                        document.documentElement.classList.add('scrolled')
                    }
                }

                // Listen for new scroll events, here we debounce our "storeScroll" function
                document.addEventListener('scroll', debounce(storeScroll), {
                    passive: true,
                })

                // Update scroll position for first time
                storeScroll()
            </script>
        </body>
    </html>
`
