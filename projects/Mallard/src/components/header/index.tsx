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

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <View style={[styles.background]}>
        <View>
            <Text style={styles.text}>{title}</Text>
            {subtitle && (
                <Text style={[styles.text, styles.subtitle]}>{subtitle}</Text>
            )}
        </View>
    </View>
)
export { Header }
