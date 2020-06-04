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
import { StyleSheet, View, Text, Alert } from 'react-native'
import { Highlight } from 'src/components/highlight'
import { DLStatus } from 'src/helpers/files'
import { Button, ButtonAppearance } from '../Button/Button'
import ProgressCircle from 'react-native-progress-circle'
import { color } from 'src/theme/color'
import { imageForScreenSize } from 'src/helpers/screen'
import { useToast } from 'src/hooks/use-toast'
import { DOWNLOAD_ISSUE_MESSAGE_OFFLINE } from 'src/helpers/words'
import { sendComponentEvent, ComponentType, Action } from 'src/services/ophan'
import { Loaded } from 'src/helpers/Loaded'

import { useIssueOnDevice, ExistsStatus } from 'src/hooks/use-issue-on-device'
import { Front, IssueWithFronts, Appearance } from '../../../../Apps/common/src'
import { getPillarColors } from 'src/helpers/transform'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { colour } from '@guardian/pasteup/palette'

import { useNetInfo, DownloadBlockedStatus } from 'src/hooks/use-net-info'
import { NOT_CONNECTED, WIFI_ONLY_DOWNLOAD } from 'src/helpers/words'
import { UiBodyCopy } from '../styled-text'
import { useApolloClient } from '@apollo/react-hooks'
import {
    downloadAndUnzipIssue,
    stopListeningToExistingDownload,
    maybeListenToExistingDownload,
} from 'src/download-edition/download-and-unzip'

const FRONT_TITLE_FONT = getFont('titlepiece', 1.25)
const ISSUE_TITLE_FONT = getFont('titlepiece', 1.25)

export const ISSUE_ROW_HEADER_HEIGHT = Math.floor(
    ISSUE_TITLE_FONT.lineHeight * 2.6,
)
export const ISSUE_FRONT_ROW_HEIGHT = Math.floor(
    FRONT_TITLE_FONT.lineHeight * 1.65,
)
export const ISSUE_FRONT_ERROR_HEIGHT = 120

const styles = StyleSheet.create({
    frontsSelector: {
        backgroundColor: color.dimmerBackground,
        borderTopWidth: 1,
        borderTopColor: color.line,
    },
    errorMessage: {
        height: ISSUE_FRONT_ERROR_HEIGHT,
        paddingHorizontal: metrics.horizontal,
        paddingTop: metrics.vertical,
    },

    frontTitleWrap: {
        flex: 1,
        height: ISSUE_FRONT_ROW_HEIGHT,
    },
    frontTitle: {
        height: '100%',
        paddingTop: ISSUE_FRONT_ROW_HEIGHT * 0.1,
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
    const { downloadBlocked, isConnected } = useNetInfo()
    const client = useApolloClient()

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
        if (isConnected) {
            if (!dlStatus) {
                sendComponentEvent({
                    componentType: ComponentType.appButton,
                    action: Action.click,
                    value: 'issues_list_issue_clicked',
                })
                const imageSize = await imageForScreenSize()
                downloadAndUnzipIssue(client, issue, imageSize, handleUpdate)
            }
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
            borderWidth={2}
            shadowColor="#ccc"
            color={color.primary}
        >
            <Button
                accessible={true}
                accessibilityLabel="Download edition"
                accessibilityHint="Downloads the edition to your device, so you can listen to it when offline"
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
    ({
        issue,
        onGoToSettings,
    }: {
        issue: IssueSummary
        onGoToSettings: () => void
    }) => (
        <View style={styles.issueButtonContainer}>
            <IssueButton issue={issue} onGoToSettings={onGoToSettings} />
        </View>
    ),
)

/**
 * Custom palette for Front titles. We use the dark variants for some pillars
 * because their "main" counterpart isn't legible enough for text on a light
 * background.
 */
const DARK_COLOURED_PILLARS = new Set(['culture', 'lifestyle'])
const getCustomColor = (appr: Appearance): colour => {
    if (appr.type === 'pillar') {
        const colors = getPillarColors(appr.name)
        return DARK_COLOURED_PILLARS.has(appr.name) ? colors.dark : colors.main
    }
    if (appr.type === 'custom') return appr.color
    return getPillarColors('neutral').main
}

const IssueFrontRow = React.memo(
    ({ front, onPress }: { front: Front; onPress: () => void }) => {
        const textColor = getCustomColor(front.appearance)
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
    ({
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
            <GridRowSplit
                proxy={
                    <IssueButtonContainer
                        issue={issue}
                        onGoToSettings={onGoToSettings}
                    />
                }
            >
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

const IssueFrontsError = () => (
    <View style={styles.frontsSelector}>
        <UiBodyCopy style={styles.errorMessage}>
            We could not load the sections of this edition. If you{"'"}re
            offline, try going online and downloading the edition. Otherwise,
            close and open the app&nbsp;again.
        </UiBodyCopy>
    </View>
)

export const IssueRow = React.memo(
    ({
        issue,
        issueDetails,
        onPress,
        onPressFront,
        onGoToSettings,
    }: {
        issue: IssueSummary
        issueDetails: Loaded<IssueWithFronts> | null
        onPress: () => void
        onPressFront: (key: string) => void
        onGoToSettings: () => void
    }) => (
        <>
            <IssueRowHeader
                onPress={onPress}
                issue={issue}
                onGoToSettings={onGoToSettings}
            />
            {issueDetails != null && issueDetails.value != null && (
                <IssueFrontsSelector
                    fronts={issueDetails.value.fronts}
                    onPressFront={onPressFront}
                />
            )}
            {issueDetails != null && issueDetails.error != null && (
                <IssueFrontsError />
            )}
        </>
    ),
)
