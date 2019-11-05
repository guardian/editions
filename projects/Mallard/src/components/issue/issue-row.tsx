import React, { useMemo, useState, useEffect, useCallback } from 'react'
import {
    IssueTitle,
    IssueTitleAppearance,
    GridRowSplit,
} from 'src/components/issue/issue-title'
import { RowWrapper } from '../layout/ui/row'
import { IssueSummary } from 'src/common'
import { renderIssueDate } from 'src/helpers/issues'
import { StyleSheet, View, Alert } from 'react-native'
import { Highlight } from 'src/components/highlight'
import {
    DLStatus,
    downloadAndUnzipIssue,
    maybeListenToExistingDownload,
    stopListeningToExistingDownload,
} from 'src/helpers/files'
import { Button, ButtonAppearance } from '../button/button'
import ProgressCircle from 'react-native-progress-circle'
import { color } from 'src/theme/color'
import { imageForScreenSize } from 'src/helpers/screen'
import { fetch } from 'src/hooks/use-net-info'
import { useToast } from 'src/hooks/use-toast'
import { DOWNLOAD_ISSUE_MESSAGE_OFFLINE } from 'src/helpers/words'
import { sendComponentEvent, ComponentType, Action } from 'src/services/ophan'
import { useIssueOnDevice, ExistsStatus } from 'src/hooks/use-issue-on-device'
import { useNetInfo, DownloadBlockedStatus } from 'src/hooks/use-net-info'
import { NOT_CONNECTED, WIFI_ONLY_DOWNLOAD } from 'src/helpers/words'

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

const IssueButton = ({
    issue,
    onGoToSettings,
}: {
    issue: IssueSummary
    onGoToSettings: () => void
}) => {
    const isOnDevice = useIssueOnDevice(issue.localId)
    const [dlStatus, setDlStatus] = useState<DLStatus | null>(null)
    const { showToast } = useToast()
    const { downloadBlocked } = useNetInfo()

    const handleUpdate = useCallback(
        (status: DLStatus) => {
            setDlStatus(status)
            return () => {
                stopListeningToExistingDownload(issue, handleUpdate)
            }
        },
        [issue],
    )

    useEffect(() => {
        maybeListenToExistingDownload(issue, handleUpdate)
    }, [issue, handleUpdate])

    const onDownloadIssue = async () => {
        if (isOnDevice !== ExistsStatus.doesNotExist) return
        switch (downloadBlocked) {
            case DownloadBlockedStatus.Offline: {
                Alert.alert('Unable to download', NOT_CONNECTED)
                return
            }
            case DownloadBlockedStatus.WifiOnly: {
                Alert.alert('Unable to download', WIFI_ONLY_DOWNLOAD, [
                    { text: 'Manage editions', onPress: onGoToSettings },
                    { text: 'Ok' },
                ])
                return
            }
        }
        if ((await fetch()).isConnected && !dlStatus) {
            sendComponentEvent({
                componentType: ComponentType.appButton,
                action: Action.click,
                value: 'issues_list_issue_clicked',
            })
            const imageSize = await imageForScreenSize()
            downloadAndUnzipIssue(issue, imageSize, handleUpdate)
        } else {
            showToast(DOWNLOAD_ISSUE_MESSAGE_OFFLINE)
        }
    }

    return (
        <ProgressCircle
            percent={dlStatus ? getStatusPercentage(dlStatus) || 100 : 100}
            radius={20}
            bgColor={
                isOnDevice === ExistsStatus.doesExist
                    ? color.primary
                    : undefined
            }
            borderWidth={1}
            shadowColor="#ccc"
            color={color.primary}
        >
            <Button
                onPress={onDownloadIssue}
                icon={
                    isOnDevice === ExistsStatus.doesExist ? '\uE062' : '\uE077'
                }
                alt={'Download'}
                appearance={ButtonAppearance.skeleton}
                textStyles={{
                    color:
                        isOnDevice !== ExistsStatus.doesExist
                            ? color.primary
                            : color.palette.neutral[100],
                }}
            />
        </ProgressCircle>
    )
}

const IssueRow = ({
    issue,
    onPress,
    onGoToSettings,
}: {
    issue: IssueSummary
    onPress: () => void
    onGoToSettings: () => void
}) => {
    const { date, weekday } = useMemo(() => renderIssueDate(issue.date), [
        issue.date,
    ])

    return (
        <RowWrapper narrow>
            <GridRowSplit
                proxy={
                    <IssueButton
                        issue={issue}
                        onGoToSettings={onGoToSettings}
                    />
                }
            >
                <View style={rowStyles.issueRow}>
                    <Highlight
                        hitSlop={{ top: 10, bottom: 10, left: 60, right: 60 }}
                        onPress={onPress}
                    >
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
