import React, { ReactElement } from 'react'
import { useAppAppearance } from 'src/theme/appearance'
import { Highlight } from 'src/components/highlight'
import { View, StyleSheet, SafeAreaView } from 'react-native'
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
        paddingVertical: metrics.vertical,
        marginVertical: StyleSheet.hairlineWidth,
    },
    itemFlexer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemFlexerShrinker: { flexShrink: 1 },
})

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
    explainer?: string
}

interface RowProps extends RowContentProps {
    proxy?: ReactElement
}

const RowContents = ({ title, explainer }: RowContentProps) => (
    <>
        <UiBodyCopy>{title}</UiBodyCopy>
        {explainer && (
            <UiExplainerCopy style={{ marginTop: metrics.vertical / 8 }}>
                {explainer}
            </UiExplainerCopy>
        )}
    </>
)

const Row = ({ proxy, ...contents }: RowProps) => {
    const { backgroundColor } = useAppAppearance()

    return (
        <View
            style={[
                styles.item,
                {
                    backgroundColor,
                },
            ]}
        >
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
        </View>
    )
}

const TappableRow = ({
    onPress,
    ...props
}: RowProps & { onPress: () => void }) => (
    <Highlight onPress={onPress}>
        <Row {...props} />
    </Highlight>
)

export { Separator, Row, TappableRow, Heading }
