import { Platform } from 'react-native'
import { bundles } from 'src/html-bundle-info.json'

/* this tricks vs code into thinking we are using emotion */
export const css = (
    literals: TemplateStringsArray,
    ...placeholders: any[]
): string =>
    literals.reduce((acc, literal, i) => {
        if (placeholders[i]) {
            return acc + literal + placeholders[i]
        }
        return acc + literal
    }, '')

export const generateAssetsFontCss = (fontFamily: string) => {
    const fileName = Platform.select({
        ios: `file:///assets/fonts/${fontFamily}.ttf`,
        android: `file:///android_asset/fonts/${fontFamily}.ttf`,
    })

    return css`
        @font-face {
            font-family: '${fontFamily}';
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

/* makes some HTML and posts the height back */
export const makeHtml = ({
    styles,
    html,
}: {
    styles: string
    html: string
}) => `
<html>
<head>
    <style>
      ${styles}
    </style>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <div id="app">
        ${html}
    </div>
    <script>
        window.requestAnimationFrame(function() {
            window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight)
        })
    </script>
</body>
</html>
`
