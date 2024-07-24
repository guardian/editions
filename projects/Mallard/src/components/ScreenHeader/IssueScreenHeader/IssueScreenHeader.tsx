import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import type {
	IssueWithFronts,
	SpecialEditionHeaderStyles,
} from '../../../common';
import { IssueTitle } from '../../../components/issue/issue-title';
import { Header } from '../../../components/layout/header/header';
import { styles } from '../../../components/styled-text';
import { logEvent } from '../../../helpers/analytics';
import { useIssueDate } from '../../../helpers/issues';
import { useEditions } from '../../../hooks/use-edition-provider';
import type { MainStackParamList } from '../../../navigation/NavigationModels';
import { RouteNames } from '../../../navigation/NavigationModels';
import { remoteConfigService } from '../../../services/remote-config';
import { IssueMenuButton } from '../../Button/IssueMenuButton';
import { EditionsMenuButton } from '../../EditionsMenu/EditionsMenuButton/EditionsMenuButton';

interface Titles {
	title: string;
	subTitle: string;
	titleStyle: any;
}

const IssueScreenHeader = React.memo(
	({
		headerStyles,
		issue,
	}: {
		headerStyles?: SpecialEditionHeaderStyles;
		issue?: IssueWithFronts;
	}) => {
		const { navigate } =
			useNavigation<NativeStackNavigationProp<MainStackParamList>>();
		const { date, weekday } = useIssueDate(issue);
		const { setNewEditionSeen, selectedEdition } = useEditions();

		const getDateString = useCallback(() => {
			const abbreviatedDay = weekday.substring(0, 3);
			return `${abbreviatedDay} ${date}`;
		}, [date, weekday]);

		const goToIssueList = useCallback(() => {
			navigate(RouteNames.IssueList);
		}, [navigate]);

		const handleEditionMenuPress = useCallback(() => {
			setNewEditionSeen();
			navigate(RouteNames.EditionsMenu);
			logEvent({
				name: 'editions_menu_button',
				value: 'editions_menu_button_opened',
			});
		}, [setNewEditionSeen, navigate]);

		const isSpecialEdition = (editionType: string) => {
			return editionType === 'Special';
		};

		const getTitles = (): Titles => {
			if (isSpecialEdition(selectedEdition.editionType)) {
				const splitTitle = selectedEdition.title.split('\n');
				return {
					title: splitTitle[0],
					subTitle: splitTitle[1],
					titleStyle: styles.issueHeavyText,
				};
			}
			const dateString = getDateString();
			return {
				title: selectedEdition.title,
				subTitle: dateString,
				titleStyle: styles.issueLightText,
			};
		};

		const { title, subTitle, titleStyle } = getTitles();

		const isEditionsMenuEnabled = remoteConfigService.getBoolean(
			'is_editions_menu_enabled',
		);

		return (
			<Header
				onPress={goToIssueList}
				action={<IssueMenuButton onPress={goToIssueList} />}
				leftAction={
					<EditionsMenuButton
						disabled={!isEditionsMenuEnabled}
						onPress={handleEditionMenuPress}
					/>
				}
				headerStyles={headerStyles}
			>
				{title ? (
					<IssueTitle
						title={title}
						subtitle={subTitle}
						titleStyle={titleStyle}
						overwriteStyles={headerStyles}
					/>
				) : null}
			</Header>
		);
	},
);

export { IssueScreenHeader };
