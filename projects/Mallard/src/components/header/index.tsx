import React, { ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { IssueTitle, IssueTitleProps, IssueRowSplit } from '../issue'
import { useInsets } from 'src/hooks/use-insets'

const styles = StyleSheet.create({
    background: {
        backgroundColor: color.primary,
        padding: metrics.vertical,
        paddingHorizontal: metrics.horizontal,
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    flex: {
        flexDirection: 'row',
    },
})

const Header = ({
    action,
    ...IssueIssueTitleProps
}: {
    action?: ReactNode
} & IssueTitleProps) => {
    const { top: paddingTop } = useInsets()
    return (
        <View style={[styles.background]}>
            <IssueRowSplit style={{ paddingTop }}>
                <View
                    style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        flexGrow: 1,
                    }}
                >
                    <IssueTitle {...IssueIssueTitleProps} />
                    {action}
                </View>
            </IssueRowSplit>
        </View>
    )
}
export { Header }
