import React, { ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import {
    IssueTitle,
    IssueTitleProps,
    GridRowSplit,
} from 'src/components/issue/issue-title'
import { useInsets } from 'src/hooks/use-screen'
import { WithAppAppearance } from 'src/theme/appearance'
import { useIssueDate } from 'src/helpers/issues'
import { Issue } from 'src/common'
import { Highlight } from 'src/components/highlight'

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
    headerSplit: {
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
    },
    headerTitle: {
        flexGrow: 1,
        flexShrink: 0,
    },
})

type TouchableHeaderProps =
    | { onPress: () => void; accessibilityHint: string }
    | {}

type HeaderProps = {
    action?: ReactNode
    leftAction?: ReactNode
} & IssueTitleProps &
    TouchableHeaderProps

const Header = ({ action, leftAction, ...otherProps }: HeaderProps) => {
    const { top: paddingTop } = useInsets()
    return (
        <WithAppAppearance value={'primary'}>
            <View style={[styles.background]}>
                <GridRowSplit proxy={leftAction} style={{ paddingTop }}>
                    <View style={styles.headerSplit}>
                        <View style={styles.headerTitle}>
                            {'onPress' in otherProps ? (
                                <Highlight
                                    onPress={otherProps.onPress}
                                    accessibilityHint={
                                        otherProps.accessibilityHint
                                    }
                                >
                                    <IssueTitle {...otherProps} />
                                </Highlight>
                            ) : (
                                <IssueTitle {...otherProps} />
                            )}
                        </View>
                        {action}
                    </View>
                </GridRowSplit>
            </View>
        </WithAppAppearance>
    )
}

const IssueHeader = ({
    issue,
    ...headerProps
}: { issue?: Issue } & Omit<HeaderProps, 'title' | 'subtitle'> &
    TouchableHeaderProps) => {
    const { date, weekday } = useIssueDate(issue)
    return <Header {...headerProps} title={weekday} subtitle={date} />
}

export { Header, IssueHeader }
