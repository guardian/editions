import React from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { TitlepieceText, UiBodyCopy } from '../styled-text'
import { color } from 'src/theme/color'
import { getFont } from 'src/theme/typography'
import { ButtonAppearance } from '../Button/Button'
import { SpecialEditionHeaderStyles } from '../../../../Apps/common/src'
import { ModalButton } from '../Button/ModalButton'
import DeviceInfo from 'react-native-device-info'
import { lifestyle } from '@guardian/src-foundations/palette'

export enum CardAppearance {
    apricot,
    blue,
}

const isTablet = DeviceInfo.isTablet()

const modalStyles = (backgroundColor: string, textColor: string) =>
    StyleSheet.create({
        wrapper: {
            position: 'absolute',
            top: isTablet
                ? Platform.OS === 'android'
                    ? '6%'
                    : 80
                : Platform.OS === 'android'
                ? '8%'
                : '11.5%',
            left: isTablet ? 12 : '3%',
            width: isTablet ? 365 : 300,
            zIndex: 1,
        },
        container: {
            flex: 1,
            backgroundColor: lifestyle[300],
            overflow: 'hidden',
            padding: 12,
            borderRadius: 5,
        },
        bubblePointer: {
            left: 12.5,
            top: 1,
            width: 0,
            height: 0,
            borderLeftWidth: 11,
            borderRightWidth: 11,
            borderBottomWidth: 22,
            borderStyle: 'solid',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: lifestyle[300],
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
                        styles.titleText,
                        { marginBottom: 5 },
                    ]}
                >
                    {/* QUESTION: SHOULD TITLE BE ON A NEW LINE?*/}
                    {modalText.title}
                </TitlepieceText>
                <UiBodyCopy
                    weight="regular"
                    style={[
                        getFont('text', 1.25),
                        { marginBottom: 18 },
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
                            textStyles={getFont('sans', 1.5, 'bold')}
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
