import React, { ReactNode } from 'react'
import { Text, View, StyleSheet, SafeAreaView, Button } from 'react-native'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'

const styles = StyleSheet.create({
    background: {
        backgroundColor: color.palette.brand.dark,
        padding: metrics.vertical,
        paddingHorizontal: metrics.horizontal,
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    text: {
        fontFamily: 'GTGuardianTitlepiece-Bold',
        fontSize: 24,
        lineHeight: 24,
        color: color.textOverPrimary,
    },
    subtitle: {
        color: color.palette.highlight.main,
    },
})

const Header = ({
    title,
    subtitle,
    action,
}: {
    title: string
    subtitle?: string
    action?: ReactNode
}) => (
    <View style={[styles.background]}>
        <SafeAreaView>
            {action}
            <View>
                <Text style={styles.text}>{title}</Text>
                {subtitle && (
                    <Text style={[styles.text, styles.subtitle]}>
                        {subtitle}
                    </Text>
                )}
            </View>
        </SafeAreaView>
    </View>
)
export { Header }
