import { Platform } from 'react-native'

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
