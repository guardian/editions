import React, {
    useMemo,
    ReactNode,
    useState,
    useEffect,
    useCallback,
} from 'react'
import {
    IssueTitle,
    IssueTitleAppearance,
    GridRowSplit,
} from 'src/components/issue/issue-title'
import { RowWrapper } from '../layout/ui/row'
import { IssueSummary } from 'src/common'
import { renderIssueDate } from 'src/helpers/issues'
import { Text, StyleSheet, StyleProp, ViewStyle, View } from 'react-native'
import { Highlight } from 'src/components/highlight'
import {
    DLStatus,
    downloadAndUnzipIssue,
    maybeListenToExistingDownload,
    stopListeningToExistingDownload,
} from 'src/helpers/files'
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

const IssueButton = ({ issue }: { issue: IssueSummary }) => {
    const [exists, setExists] = useState<ExistsStatus>(ExistsStatus.pending)
    const [dlStatus, setDlStatus] = useState<DLStatus | null>(null)
    const { showToast } = useToast()

    const handleUpdate = useCallback((status: DLStatus) => {
        setDlStatus(status)
        if (status.type === 'success') {
            setExists(ExistsStatus.doesExist)
        }
    }, [])

    useEffect(() => {
        const isDownloading = maybeListenToExistingDownload(issue, handleUpdate)
        setExists(ExistsStatus.pending)
        if (isDownloading) return

        RNFetchBlob.fs.exists(FSPaths.issue(issue.key)).then(exists => {
            if (exists) {
                RNFetchBlob.fs
                    .exists(FSPaths.mediaRoot(issue.key))
                    .then(exists => {
                        setExists(
                            exists
                                ? ExistsStatus.doesExist
                                : ExistsStatus.doesNotExist,
                        )
                    })
            } else {
                setExists(ExistsStatus.doesNotExist)
            }
        })

        return () => {
            stopListeningToExistingDownload(issue, handleUpdate)
        }
    }, [issue, handleUpdate])

    const onDownloadIssue = async () => {
        if (exists !== ExistsStatus.doesNotExist) return
        setExists(ExistsStatus.pending)
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
                exists === ExistsStatus.doesExist ? color.primary : undefined
            }
            borderWidth={1}
            shadowColor="#ccc"
            color={color.primary}
        >
            <Button
                onPress={onDownloadIssue}
                icon={exists === ExistsStatus.doesExist ? '\uE062' : '\uE077'}
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
    )
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

    return (
        <RowWrapper narrow>
            <GridRowSplit proxy={<IssueButton issue={issue} />}>
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
