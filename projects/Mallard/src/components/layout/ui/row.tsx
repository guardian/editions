import React, { ReactElement, ReactNode } from 'react'
import { useAppAppearance } from 'src/theme/appearance'
import { Highlight } from 'src/components/highlight'
import {
    View,
    StyleSheet,
    SafeAreaView,
    ViewStyle,
    StyleProp,
} from 'react-native'
import { UiBodyCopy, UiExplainerCopy } from 'src/components/styled-text'
import { metrics } from 'src/theme/spacing'

const styles = StyleSheet.create({
    heading: {
        padding: metrics.horizontal,
        paddingTop: metrics.vertical * 2,
        paddingBottom: metrics.vertical / 2,
    },
    item: {
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical / 1.5,
        paddingBottom: metrics.vertical * 1.5,
        marginVertical: StyleSheet.hairlineWidth,
    },
    itemFlexer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemFlexerShrinker: { flexShrink: 1 },
    footer: {
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
        paddingBottom: metrics.vertical * 2,
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
})

const Footer = ({
    children,
    style,
}: {
    children: ReactNode
    style?: StyleProp<ViewStyle>
}) => <View style={[styles.footer, style]}>{children}</View>

const Heading = ({ children }: { children: string }) => (
    <View style={styles.heading}>
        <SafeAreaView>
            <UiBodyCopy weight="bold">{children}</UiBodyCopy>
        </SafeAreaView>
    </View>
)

const Separator = () => {
    const { borderColor } = useAppAppearance()

    return (
        <View
            style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: borderColor,
            }}
        />
    )
}

interface RowContentProps {
    title: string
    explainer?: Element
}

const RowContents = ({ title, explainer }: RowContentProps) => (
    <>
        <UiBodyCopy weight="bold">{title}</UiBodyCopy>
        {explainer && (
            <UiExplainerCopy style={{ marginTop: metrics.vertical / 8 }}>
                {explainer}
            </UiExplainerCopy>
        )}
    </>
)

const Row = ({
    proxy,
    onPress,
    ...contents
}: RowContentProps &
    RowWrapperProps & {
        proxy?: ReactElement
    }) => {
    return (
        <RowWrapper onPress={onPress}>
            {proxy ? (
                <View style={styles.itemFlexer}>
                    <View style={styles.itemFlexerShrinker}>
                        <RowContents {...contents} />
                    </View>
                    {proxy}
                </View>
            ) : (
                <RowContents {...contents} />
            )}
        </RowWrapper>
    )
}

const tallRowStyles = StyleSheet.create({
    split: {
        marginBottom: metrics.vertical,
        alignItems: 'flex-start',
    },
})

const TallRow = ({
    proxy,
    onPress,
    ...contents
}: RowContentProps &
    RowWrapperProps & {
        proxy?: ReactElement
    }) => (
    <RowWrapper onPress={onPress}>
        <View style={tallRowStyles.split}>
            <RowContents {...contents} />
        </View>
        {proxy}
    </RowWrapper>
)

export interface RowWrapperProps {
    onPress?: () => void
}

const RowWrapper = ({
    children,
    onPress,
}: {
    children: ReactNode
} & RowWrapperProps) => {
    const { cardBackgroundColor: backgroundColor } = useAppAppearance()

    return onPress ? (
        <Highlight onPress={onPress}>
            <View
                style={[
                    styles.item,
                    {
                        backgroundColor,
                    },
                ]}
            >
                {children}
            </View>
        </Highlight>
    ) : (
        <View
            style={[
                styles.item,
                {
                    backgroundColor,
                },
            ]}
        >
            {children}
        </View>
    )
}

export { Separator, Row, TallRow, RowWrapper, Footer, Heading }
