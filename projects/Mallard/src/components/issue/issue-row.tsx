import React, {
    useMemo,
    useState,
    useEffect,
    useCallback,
    Fragment,
} from 'react'
import {
    IssueTitle,
    IssueTitleAppearance,
    GridRowSplit,
} from 'src/components/issue/issue-title'
import { IssueSummary } from 'src/common'
import { renderIssueDate } from 'src/helpers/issues'
import { StyleSheet, View, Text } from 'react-native'
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
import { Loaded } from 'src/helpers/Loaded'

import { useIssueOnDevice, ExistsStatus } from 'src/hooks/use-issue-on-device'
import { Front, IssueWithFronts } from '../../../../Apps/common/src'
import { getColor } from 'src/helpers/transform'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'

const FRONT_TITLE_FONT = getFont('titlepiece', 1.25)
const ISSUE_TITLE_FONT = getFont('titlepiece', 1.25)

export const ISSUE_ROW_HEADER_HEIGHT = ISSUE_TITLE_FONT.lineHeight * 2.6
export const ISSUE_FRONT_ROW_HEIGHT = FRONT_TITLE_FONT.lineHeight * 1.9

const styles = StyleSheet.create({
    frontsSelector: {
        backgroundColor: color.dimmerBackground,
        borderTopWidth: 1,
        borderTopColor: color.line,
    },
    errorMessage: {
        height: ISSUE_FRONT_ROW_HEIGHT,
        paddingHorizontal: metrics.horizontal,
        paddingTop: metrics.vertical,
    },

    frontTitleWrap: {
        flex: 1,
        height: ISSUE_FRONT_ROW_HEIGHT,
    },
    frontTitle: {
        height: '100%',
        paddingTop: ISSUE_FRONT_ROW_HEIGHT * 0.15,
        paddingHorizontal: metrics.horizontal,
    },
    frontTitleText: {
        flexShrink: 0,
        ...FRONT_TITLE_FONT,
    },

    frontSeparator: {
        height: 1,
        backgroundColor: color.line,
        flex: 1,
        marginLeft: metrics.horizontal,
    },

    issueButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
        paddingHorizontal: metrics.horizontal,
    },
    issueTitleWrap: {
        flex: 1,
        height: ISSUE_ROW_HEADER_HEIGHT,
    },
    issueTitle: {
        paddingHorizontal: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
})

const getStatusPercentage = (status: DLStatus): number | null => {
    if (status && status.type === 'download') {
        return status.data
    }
    return null
}

const IssueButton = ({ issue }: { issue: IssueSummary }) => {
    const isOnDevice = useIssueOnDevice(issue.localId)
    const [dlStatus, setDlStatus] = useState<DLStatus | null>(null)
    const { showToast } = useToast()

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

const IssueButtonContainer = React.memo(
    ({ issue }: { issue: IssueSummary }) => (
        <View style={styles.issueButtonContainer}>
            <IssueButton issue={issue} />
        </View>
    ),
)

const IssueFrontRow = React.memo(
    ({ front, onPress }: { front: Front; onPress: () => void }) => {
        const textColor = getColor(front.appearance)
        return (
            <GridRowSplit>
                <View style={styles.frontTitleWrap}>
                    <Highlight onPress={onPress}>
                        <View style={styles.frontTitle}>
                            <Text
                                style={[
                                    styles.frontTitleText,
                                    { color: textColor },
                                ]}
                                numberOfLines={1}
                            >
                                {front.displayName}
                            </Text>
                        </View>
                    </Highlight>
                </View>
            </GridRowSplit>
        )
    },
)

const IssueFrontSeparator = React.memo(() => (
    <GridRowSplit>
        <View style={styles.frontSeparator} />
    </GridRowSplit>
))

const IssueFrontsSelector = React.memo(
    ({
        fronts,
        onPressFront,
    }: {
        fronts: Front[]
        onPressFront: (key: string) => void
    }) => {
        return (
            <View style={styles.frontsSelector}>
                {fronts.map((front, index) => (
                    <Fragment key={front.key}>
                        {index > 0 && <IssueFrontSeparator />}
                        <IssueFrontRow
                            onPress={() => onPressFront(front.key)}
                            front={front}
                        />
                    </Fragment>
                ))}
            </View>
        )
    },
)

const IssueRowHeader = React.memo(
    ({ issue, onPress }: { issue: IssueSummary; onPress: () => void }) => {
        const { date, weekday } = useMemo(() => renderIssueDate(issue.date), [
            issue.date,
        ])

        return (
            <GridRowSplit proxy={<IssueButtonContainer issue={issue} />}>
                <View style={styles.issueTitleWrap}>
                    <Highlight onPress={onPress}>
                        <IssueTitle
                            style={styles.issueTitle}
                            title={weekday}
                            subtitle={date}
                            appearance={IssueTitleAppearance.tertiary}
                        />
                    </Highlight>
                </View>
            </GridRowSplit>
        )
    },
)

export const IssueRow = React.memo(
    ({
        issue,
        issueDetails,
        onPress,
        onPressFront,
    }: {
        issue: IssueSummary
        issueDetails: Loaded<IssueWithFronts> | null
        onPress: () => void
        onPressFront: (key: string) => void
    }) => (
        <>
            <IssueRowHeader onPress={onPress} issue={issue} />
            {issueDetails != null && issueDetails.value != null && (
                <IssueFrontsSelector
                    fronts={issueDetails.value.fronts}
                    onPressFront={onPressFront}
                />
            )}
            {issueDetails != null && issueDetails.error != null && (
                <View style={styles.frontsSelector}>
                    <GridRowSplit>
                        <Text style={styles.errorMessage}>
                            Failed to fetch the issue
                        </Text>
                    </GridRowSplit>
                </View>
            )}
        </>
    ),
)
