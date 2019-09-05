import React, { useMemo, ReactNode, useState, useEffect } from 'react'
import {
    IssueTitle,
    IssueTitleAppearance,
    GridRowSplit,
} from 'src/components/issue/issue-title'
import { RowWrapper } from '../layout/ui/row'
import { IssueSummary } from 'src/common'
import { renderIssueDate } from 'src/helpers/issues'
import { StyleSheet, StyleProp, ViewStyle, View } from 'react-native'
import { Highlight } from 'src/components/highlight'
import { DLStatus, downloadAndUnzipIssue } from 'src/helpers/files'
import { Button, ButtonAppearance } from '../button/button'
import RNFetchBlob from 'rn-fetch-blob'
import { FSPaths } from 'src/paths'
import ProgressCircle from 'react-native-progress-circle'
import { color } from 'src/theme/color'
import { imageForScreenSize } from 'src/helpers/screen'
import { fetch } from '@react-native-community/netinfo'
import { useToast } from 'src/hooks/use-toast'
import { DOWNLOAD_ISSUE_MESSAGE_OFFLINE } from 'src/helpers/words'
import { sendComponentEvent } from 'src/services/ophan'

interface GridRowSplitPropTypes {
    children: ReactNode
    proxy?: ReactNode
    style?: StyleProp<
        Pick<ViewStyle, 'paddingTop' | 'paddingVertical' | 'paddingBottom'>
    >
}

const rowStyles = StyleSheet.create({
    issueRow: {
        flexGrow: 1,
    },
})

const getStatusPercentage = (status: DLStatus): number | null => {
    if (status && status.type === 'download') {
        return status.data
    }
    return null
}

const IssueRow = ({
    issue,
    onPress,
}: {
    issue: IssueSummary
    onPress: () => void
}) => {
    const { date, weekday } = useMemo(() => renderIssueDate(issue.date), [
        issue.date,
    ])

    const [dlStatus, setDlStatus] = useState<DLStatus | null>(null)

    const [exists, setExists] = useState<boolean | null>(null)

    const { showToast } = useToast()

    useEffect(() => {
        // we probably need a better check for this
        // e.g. do we have issue json and images?
        RNFetchBlob.fs.exists(FSPaths.issue(issue.key)).then(setExists)
    }, [issue.key])

    const onDownloadIssue = async () => {
        if ((await fetch()).isConnected && !dlStatus) {
            const onDownloadIssue = () => {
                sendComponentEvent({
                    componentType: 'APP_BUTTON',
                    action: 'CLICK',
                    value: 'issues_list_issue_clicked',
                })
                
            downloadAndUnzipIssue(issue.key, imageForScreenSize(), status => {
                setDlStatus(status)
                if (status.type === 'success') {
                    setExists(true)
                }
            })
        } else {
            showToast(DOWNLOAD_ISSUE_MESSAGE_OFFLINE)
        }
    }

    return (
        <RowWrapper>
            <GridRowSplit
                proxy={
                    <ProgressCircle
                        percent={
                            dlStatus
                                ? getStatusPercentage(dlStatus) || 100
                                : 100
                        }
                        radius={20}
                        bgColor={exists ? color.primary : undefined}
                        borderWidth={1}
                        shadowColor="#ccc"
                        color={color.primary}
                    >
                        <Button
                            onPress={onDownloadIssue}
                            icon={exists === true ? '\uE062' : '\uE077'}
                            alt={'Download'}
                            appearance={ButtonAppearance.skeleton}
                            textStyles={{
                                color: !exists
                                    ? color.primary
                                    : color.palette.neutral[100],
                            }}
                        />
                    </ProgressCircle>
                }
            >
                <View style={rowStyles.issueRow}>
                    <Highlight onPress={onPress}>
                        <IssueTitle
                            title={weekday}
                            subtitle={date}
                            appearance={IssueTitleAppearance.tertiary}
                        />
                    </Highlight>
                </View>
            </GridRowSplit>
        </RowWrapper>
    )
}

export { IssueRow }
