import React from 'react'
import { View, StyleSheet } from 'react-native'
import { TitlepieceText, UiBodyCopy } from '../styled-text'
import { color } from 'src/theme/color'
import { getFont } from 'src/theme/typography'
import { ButtonAppearance } from '../Button/Button'
import { SpecialEditionHeaderStyles } from '../../../../Apps/common/src'
import { ModalButton } from '../Button/ModalButton'
import DeviceInfo from 'react-native-device-info'
import { brand } from '@guardian/src-foundations/palette'

export enum CardAppearance {
    apricot,
    blue,
}

const isTablet = DeviceInfo.isTablet()

const modalStyles = (backgroundColor: string, textColor: string) =>
    StyleSheet.create({
        wrapper: {
            position: 'absolute',
            top: isTablet ? 80 : '11.5%',
            left: isTablet ? 12 : '3%',
            width: isTablet ? '50%' : '77%',
            zIndex: 1,
        },
        container: {
            flex: 1,
            backgroundColor: brand[800],
            overflow: 'hidden',
            padding: 10,
            borderRadius: 5,
        },
        bubblePointer: {
            left: 12.5,
            width: 0,
            height: 0,
            borderLeftWidth: 11,
            borderRightWidth: 11,
            borderBottomWidth: 22,
            borderStyle: 'solid',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: brand[800],
        },
        buttonWrapper: {
            width: '40%',
        },
        background: { backgroundColor: backgroundColor },
        titleText: { color: textColor },
        subtitleText: { color: textColor },
    })

const NewEditionCard = ({
    onDismissThisCard,
    headerStyle,
    modalText,
}: {
    onDismissThisCard?: () => void
    headerStyle?: SpecialEditionHeaderStyles
    modalText: { title: string; bodyText: string; dismissButtonText: string }
}) => {
    const styles = headerStyle
        ? modalStyles(
              headerStyle.backgroundColor,
              headerStyle.textColorPrimary || 'white',
          )
        : modalStyles(color.ui.sea, color.background)
    return (
        <View style={styles.wrapper}>
            <View style={[styles.bubblePointer]} />
            <View style={[styles.background, styles.container]}>
                <TitlepieceText
                    accessibilityRole="header"
                    style={[
                        getFont('headline', 1.6, 'bold'),
                        { marginBottom: 16 },
                        styles.titleText,
                    ]}
                >
                    {/* QUESTION: SHOULD TITLE BE ON A NEW LINE?*/}
                    {modalText.title}
                </TitlepieceText>
                <UiBodyCopy
                    weight="regular"
                    style={[
                        getFont('text', 1.25, 'regular'),
                        { marginBottom: 8 },
                        styles.titleText,
                    ]}
                >
                    {modalText.bodyText}
                </UiBodyCopy>
                {onDismissThisCard && (
                    <View style={styles.buttonWrapper}>
                        <ModalButton
                            buttonAppearance={ButtonAppearance.black}
                            onPress={onDismissThisCard}
                        >
                            {modalText.dismissButtonText}
                        </ModalButton>
                    </View>
                )}
            </View>
        </View>
    )
}

export { NewEditionCard }
