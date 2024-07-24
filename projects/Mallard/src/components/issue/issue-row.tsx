import type { colour } from '@guardian/pasteup/palette';
import React, {
	Fragment,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { CircularProgressBase } from 'react-native-circular-progress-indicator';
import type {
	Appearance,
	Front,
	IssueSummary,
	IssueWithFronts,
} from '../../common';
import { Highlight } from '../../components/highlight';
import {
	GridRowSplit,
	IssueTitle,
	IssueTitleAppearance,
} from '../../components/issue/issue-title';
import { styles as textStyles, UiBodyCopy } from '../../components/styled-text';
import {
	downloadAndUnzipIssue,
	maybeListenToExistingDownload,
	stopListeningToExistingDownload,
} from '../../download-edition/download-and-unzip';
import { logEvent } from '../../helpers/analytics';
import type { DLStatus } from '../../helpers/files';
import { renderIssueDate } from '../../helpers/issues';
import type { Loaded } from '../../helpers/Loaded';
import { imageForScreenSize } from '../../helpers/screen';
import { getPillarColors } from '../../helpers/transform';
import {
	DOWNLOAD_ISSUE_MESSAGE_FAILED,
	DOWNLOAD_ISSUE_MESSAGE_OFFLINE,
	NOT_CONNECTED,
	WIFI_ONLY_DOWNLOAD,
} from '../../helpers/words';
import { useEditions } from '../../hooks/use-edition-provider';
import {
	ExistsStatus,
	useIssueOnDevice,
} from '../../hooks/use-issue-on-device';
import {
	DownloadBlockedStatus,
	useNetInfo,
} from '../../hooks/use-net-info-provider';
import { useToast } from '../../hooks/use-toast';
import { color } from '../../theme/color';
import { metrics } from '../../theme/spacing';
import { getFont } from '../../theme/typography';
import { Button, ButtonAppearance } from '../Button/Button';

const FRONT_TITLE_FONT = getFont('titlepiece', 1.25);
const ISSUE_TITLE_FONT = getFont('titlepiece', 1.25);

export const ISSUE_ROW_HEADER_HEIGHT = Math.floor(
	ISSUE_TITLE_FONT.lineHeight * 2.6,
);
export const ISSUE_FRONT_ROW_HEIGHT = Math.floor(
	FRONT_TITLE_FONT.lineHeight * 1.65,
);
export const ISSUE_FRONT_ERROR_HEIGHT = 120;

const styles = StyleSheet.create({
	frontsSelector: {
		backgroundColor: color.dimmerBackground,
		borderTopWidth: 1,
		borderTopColor: color.line,
		paddingLeft: 90,
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
	},
	frontTitleText: {
		flexShrink: 0,
		...FRONT_TITLE_FONT,
	},

	frontSeparator: {
		height: 1,
		backgroundColor: color.line,
		flex: 1,
	},

	issueButtonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		flexGrow: 1,
		paddingHorizontal: metrics.horizontal,
		width: 90,
	},
	issueTitleWrap: {
		flex: 1,
		height: ISSUE_ROW_HEADER_HEIGHT,
	},
	issueTitle: {
		paddingRight: metrics.horizontal,
		paddingVertical: metrics.vertical,
	},
});

const getStatusPercentage = (status: DLStatus): number | null => {
	if (status && status.type === 'download') {
		return status.data;
	}
	return null;
};

const IssueButton = ({
	issue,
	onGoToSettings,
}: {
	issue: IssueSummary;
	onGoToSettings: () => void;
}) => {
	const isOnDevice = useIssueOnDevice(issue.localId);
	const [dlStatus, setDlStatus] = useState<DLStatus | null>(null);
	const { showToast } = useToast();
	const { downloadBlocked, isConnected } = useNetInfo();

	const handleUpdate = useCallback(
		(status: DLStatus) => {
			setDlStatus(status);
			return () => {
				stopListeningToExistingDownload(issue, handleUpdate);
			};
		},
		[issue],
	);

	useEffect(() => {
		maybeListenToExistingDownload(issue, handleUpdate);
	}, [issue, handleUpdate]);

	const onDownloadIssue = async () => {
		if (isOnDevice !== ExistsStatus.DoesNotExist) return;
		switch (downloadBlocked) {
			case DownloadBlockedStatus.Offline: {
				Alert.alert('Unable to download', NOT_CONNECTED);
				return;
			}
			case DownloadBlockedStatus.WifiOnly: {
				Alert.alert('Unable to download', WIFI_ONLY_DOWNLOAD, [
					{ text: 'Manage downloads', onPress: onGoToSettings },
					{ text: 'OK' },
				]);
				return;
			}
		}
		if (isConnected) {
			if (!dlStatus) {
				const imageSize = await imageForScreenSize();
				const isDownloaded = await downloadAndUnzipIssue(
					issue,
					imageSize,
					downloadBlocked,
					handleUpdate,
				);
				if (!isDownloaded) {
					setDlStatus(null);
					showToast(DOWNLOAD_ISSUE_MESSAGE_FAILED);
				}
			}
		} else {
			showToast(DOWNLOAD_ISSUE_MESSAGE_OFFLINE);
		}
		logEvent({
			name: 'issues_download_attempt',
			value: issue.localId,
		});
	};

	const progressValue = useMemo(
		() => (dlStatus ? getStatusPercentage(dlStatus) ?? 100 : 100),
		[dlStatus],
	);

	return (
		<CircularProgressBase
			value={progressValue}
			maxValue={100}
			radius={20}
			circleBackgroundColor={
				isOnDevice === ExistsStatus.DoesExist
					? color.primary
					: undefined
			}
			activeStrokeWidth={2}
			inActiveStrokeWidth={1}
			activeStrokeColor={color.primary}
			inActiveStrokeColor="transparent"
		>
			<Button
				accessibilityLabel="Download edition button"
				accessibilityHint="Downloads the edition to your device, so you can listen to it when offline"
				accessibilityRole="button"
				onPress={onDownloadIssue}
				icon={
					isOnDevice === ExistsStatus.DoesExist ? '\uE062' : '\uE077'
				}
				alt={'Download'}
				appearance={ButtonAppearance.SkeletonDownload}
				textStyles={{
					color:
						isOnDevice !== ExistsStatus.DoesExist
							? color.primary
							: color.palette.neutral[100],
				}}
			/>
		</CircularProgressBase>
	);
};

const IssueButtonContainer = React.memo(
	({
		issue,
		onGoToSettings,
	}: {
		issue: IssueSummary;
		onGoToSettings: () => void;
	}) => (
		<View style={styles.issueButtonContainer}>
			<IssueButton issue={issue} onGoToSettings={onGoToSettings} />
		</View>
	),
);

/**
 * Custom palette for Front titles. We use the dark variants for some pillars
 * because their "main" counterpart isn't legible enough for text on a light
 * background.
 */
const DARK_COLOURED_PILLARS = new Set(['culture', 'lifestyle']);
const getCustomColor = (appr: Appearance): colour => {
	if (appr.type === 'pillar') {
		const colors = getPillarColors(appr.name);
		return DARK_COLOURED_PILLARS.has(appr.name) ? colors.dark : colors.main;
	}
	if (appr.type === 'custom') return appr.color;
	return getPillarColors('neutral').main;
};

const IssueFrontRow = React.memo(
	({ front, onPress }: { front: Front; onPress: () => void }) => {
		const textColor = getCustomColor(front.appearance);
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
		);
	},
);

const IssueFrontSeparator = React.memo(() => (
	<GridRowSplit>
		<View style={styles.frontSeparator} />
	</GridRowSplit>
));

const IssueFrontsSelector = React.memo(
	({
		fronts,
		onPressFront,
	}: {
		fronts: Front[];
		onPressFront: (key: string) => void;
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
		);
	},
);

const IssueRowHeader = React.memo(
	({
		issue,
		onPress,
		onGoToSettings,
	}: {
		issue: IssueSummary;
		onPress: () => void;
		onGoToSettings: () => void;
	}) => {
		const { selectedEdition } = useEditions();
		const isSpecialEdition = (editionType: string) => {
			return editionType === 'Special';
		};
		const { date, weekday } = useMemo(
			() => renderIssueDate(issue.date),
			[issue.date],
		);
		const getTitles = () => {
			if (isSpecialEdition(selectedEdition.editionType)) {
				const splitTitle = selectedEdition.title.split('\n');
				return {
					title: splitTitle[0],
					subTitle: splitTitle[1],
					subtitleStyle: textStyles.issueHeavyText,
				};
			}
			return {
				title: weekday,
				subTitle: date,
				subtitleStyle: textStyles.issueLightText,
			};
		};
		const { title, subTitle, subtitleStyle } = getTitles();
		return (
			<GridRowSplit
				proxy={
					<IssueButtonContainer
						issue={issue}
						onGoToSettings={onGoToSettings}
					/>
				}
				restrictWidth
			>
				<View style={styles.issueTitleWrap}>
					<Highlight onPress={onPress}>
						<IssueTitle
							style={styles.issueTitle}
							title={title}
							subtitle={subTitle}
							subtitleStyle={subtitleStyle}
							appearance={IssueTitleAppearance.Tertiary}
						/>
					</Highlight>
				</View>
			</GridRowSplit>
		);
	},
);

const IssueFrontsError = () => (
	<View style={styles.frontsSelector}>
		<UiBodyCopy style={styles.errorMessage}>
			We could not load the sections of this edition. If you{"'"}re
			offline, try going online and downloading the edition. Otherwise,
			close and open the app&nbsp;again.
		</UiBodyCopy>
	</View>
);

export const IssueRow = React.memo(
	({
		issue,
		issueDetails,
		onPress,
		onPressFront,
		onGoToSettings,
	}: {
		issue: IssueSummary;
		issueDetails: Loaded<IssueWithFronts> | null;
		onPress: () => void;
		onPressFront: (key: string) => void;
		onGoToSettings: () => void;
	}) => (
		<>
			<IssueRowHeader
				onPress={onPress}
				issue={issue}
				onGoToSettings={onGoToSettings}
			/>
			{issueDetails?.value && (
				<IssueFrontsSelector
					fronts={issueDetails.value.fronts}
					onPressFront={onPressFront}
				/>
			)}
			{issueDetails?.error && <IssueFrontsError />}
		</>
	),
);
