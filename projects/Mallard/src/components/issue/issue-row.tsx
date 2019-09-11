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
import { sendComponentEvent, ComponentType, Action } from 'src/services/ophan'

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

enum ExistsStatus {
    pending,
    doesExist,
    doesNotExist,
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

    const [exists, setExists] = useState<ExistsStatus>(ExistsStatus.pending)

    const { showToast } = useToast()

    useEffect(() => {
        // we probably need a better check for this
        // e.g. do we have issue json and images?
        RNFetchBlob.fs
            .exists(FSPaths.issue(issue.key))
            .then(exists =>
                setExists(
                    exists ? ExistsStatus.doesExist : ExistsStatus.doesNotExist,
                ),
            )
    }, [issue.key])

    const onDownloadIssue = async () => {
        console.log('HGRUGH')
        if (exists !== ExistsStatus.doesNotExist) return
        setExists(ExistsStatus.pending)
        if ((await fetch()).isConnected && !dlStatus) {
            sendComponentEvent({
                componentType: ComponentType.appButton,
                action: Action.click,
                value: 'issues_list_issue_clicked',
            })

            downloadAndUnzipIssue(issue.key, imageForScreenSize(), status => {
                setDlStatus(status)
                if (status.type === 'success') {
                    setExists(ExistsStatus.doesExist)
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
                        bgColor={
                            exists === ExistsStatus.doesExist
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
                                exists === ExistsStatus.doesExist
                                    ? '\uE062'
                                    : '\uE077'
                            }
                            alt={'Download'}
                            appearance={ButtonAppearance.skeleton}
                            textStyles={{
                                color:
                                    exists !== ExistsStatus.doesExist
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
