import { Platform } from 'react-native'

/* this tricks vs code into thinking we are using emotion */
export const css = (a: string[], ...b: string[]) =>
    a.reduce((acc, k, i) => {
        if (b[i]) {
            return acc + k + b[i]
        }
        return acc + k
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
