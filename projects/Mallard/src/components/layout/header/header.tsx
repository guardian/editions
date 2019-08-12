import React, { ReactNode } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
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
import { getFont } from 'src/theme/typography'
import { Button, ButtonAppearance } from 'src/components/button/button'

const styles = StyleSheet.create({
    background: {
        backgroundColor: color.primary,
        padding: metrics.vertical,
        paddingHorizontal: metrics.horizontal,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        minHeight: getFont('titlepiece', 1.25).lineHeight * 2,
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

    centerWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    centerTitle: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    centerAction: {
        zIndex: 2,
    },
})

type TouchableHeaderProps =
    | { onPress: () => void; accessibilityHint: string }
    | {}

type HeaderProps = {
    action?: ReactNode
    leftAction?: ReactNode
    layout?: 'issue' | 'center'
} & IssueTitleProps &
    TouchableHeaderProps

const Header = ({
    action,
    leftAction,
    layout = 'issue',
    ...otherProps
}: HeaderProps) => {
    const { top: paddingTop } = useInsets()
    return (
        <WithAppAppearance value={'primary'}>
            <View style={[styles.background]}>
                {layout === 'issue' ? (
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
                ) : (
                    <View style={{ paddingTop, width: '100%' }}>
                        <View style={[styles.centerWrapper]}>
                            <View style={styles.centerAction}>
                                {leftAction}
                            </View>
                            <View style={styles.centerAction}>{action}</View>
                            <View style={styles.centerTitle}>
                                <IssueTitle {...otherProps} />
                            </View>
                        </View>
                    </View>
                )}
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
