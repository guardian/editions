import React, { ReactNode } from 'react'
import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    Button,
    StyleProp,
    TextStyle,
} from 'react-native'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { Title } from './title'
import { IssueSplit } from '../layout/ui/issue-row'

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
    flex: {
        flexDirection: 'row',
    },
})

export enum HeaderTitleAppearance {
    default,
    ocean,
}

interface HeaderTitleProps {
    title: string
    subtitle?: string
}

const appearances: {
    [key in HeaderTitleAppearance]: {
        subtitle: StyleProp<TextStyle>
    }
} = {
    [HeaderTitleAppearance.default]: StyleSheet.create({
        subtitle: { color: color.palette.highlight.main },
    }),
    [HeaderTitleAppearance.ocean]: StyleSheet.create({
        subtitle: { color: color.ui.tomato },
    }),
}

const Header = ({
    action,
    ...titleProps
}: {
    action?: ReactNode
} & HeaderTitleProps) => (
    <View style={[styles.background]}>
        <SafeAreaView style={[styles.flex]}>
            <IssueSplit>
                <View>
                    <Title {...titleProps} />
                </View>
                {action}
            </IssueSplit>
        </SafeAreaView>
    </View>
)
export { Header }
