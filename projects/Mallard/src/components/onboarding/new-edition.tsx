import React from 'react'
import { View, StyleSheet } from 'react-native'
import { TitlepieceText, UiBodyCopy } from '../styled-text'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { ButtonAppearance } from '../Button/Button'
import { SpecialEditionHeaderStyles } from '../../../../Apps/common/src'
import { ModalButton } from '../Button/ModalButton'

export enum CardAppearance {
    apricot,
    blue,
}

const modalStyles = (backgroundColor: string, textColor: string) =>
    StyleSheet.create({
        flexRow: {
            flexDirection: 'row',
        },
        container: {
            flex: 0,
            flexDirection: 'column',
            borderRadius: 25,
            width: 500,
            overflow: 'hidden',
            padding: 10,
        },
        top: {
            alignContent: 'space-between',
            padding: metrics.horizontal,
            paddingVertical: metrics.vertical,
        },
        titlePieceContainer: {
            alignItems: 'flex-start',
            flex: 1,
        },
        wrapper: {
            position: 'absolute',
            top: '5%',
            left: '1%',
            width: '50%',
            zIndex: 1,
        },
        bubblePointer: {
            left: 20,
            width: 0,
            height: 0,
            borderLeftWidth: 0,
            borderRightWidth: 40,
            borderBottomWidth: 40,
            borderStyle: 'solid',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: backgroundColor,
        },
        buttonWrapper: {
            alignItems: 'center',
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
            <View style={[styles.bubblePointer]}></View>
            <View style={[styles.background, styles.container]}>
                <View style={[styles.top, styles.background]}>
                    <View style={styles.flexRow}>
                        <View style={styles.titlePieceContainer}>
                            <TitlepieceText
                                accessibilityRole="header"
                                style={[
                                    getFont('titlepiece', 2),
                                    { marginBottom: 16 },
                                    styles.titleText,
                                ]}
                            >
                                {modalText.title}
                            </TitlepieceText>
                        </View>
                    </View>
                    <View>
                        <UiBodyCopy weight="bold">
                            {modalText.bodyText}
                        </UiBodyCopy>
                    </View>
                </View>
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
