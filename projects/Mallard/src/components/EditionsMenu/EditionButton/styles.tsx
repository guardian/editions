import { brand, neutral } from '@guardian/src-foundations'
import { StyleSheet } from 'react-native'

export const EDITIONS_MENU_TEXT_LEFT_PADDING = 96
const imageWidth = 67
const imageHeight = 134

const styles = (selected: boolean, special: boolean, titleColor: string) => {
    return StyleSheet.create({
        container: {
            borderColor: selected ? brand[400] : neutral[86],
            borderWidth: selected ? 4 : 1,
            borderRadius: 3,
            paddingBottom: 32,
            paddingTop: 10,
            flexDirection: 'row',
        },
        imageContainer: {
            width: EDITIONS_MENU_TEXT_LEFT_PADDING,
        },
        textContainer: {
            flex: 1,
        },
        title: {
            fontSize: special ? 32 : 20,
            lineHeight: special ? 34 : 20,
            fontWeight: special ? '400' : '700',
            marginBottom: 5,
            color: titleColor,
        },
        subTitle: {
            flexWrap: 'wrap',
            paddingRight: 20,
            color: neutral[7],
        },
        image: {
            width: imageWidth,
            height: imageHeight,
        },
    })
}

export { styles }
