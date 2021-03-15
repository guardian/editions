import { useNavigation } from '@react-navigation/native';
import React from 'react';
import type { IssueWithFronts, SpecialEditionHeaderStyles } from 'src/common';
import { useIssueDate } from 'src/helpers/issues';
import { useEditions } from 'src/hooks/use-edition-provider';
import {
	navigateToEditionMenu,
	navigateToIssueList,
} from 'src/navigation/helpers/base';
import { IssueMenuButton } from '../../Button/IssueMenuButton';
import { EditionsMenuButton } from '../../EditionsMenu/EditionsMenuButton/EditionsMenuButton';
import { ScreenHeader } from '../ScreenHeader';

const IssueScreenHeader = ({
	headerStyles,
	issue,
}: {
	headerStyles?: SpecialEditionHeaderStyles;
	issue?: IssueWithFronts;
}) => {
	const navigation = useNavigation();
	const { date, weekday } = useIssueDate(issue);

	const goToIssueList = () => {
		navigateToIssueList(navigation);
	};
	const { setNewEditionSeen } = useEditions();

	const handleEditionMenuPress = () => {
		setNewEditionSeen();
		navigateToEditionMenu(navigation);
	};

	return (
		<ScreenHeader
			title={weekday}
			subTitle={date}
			onPress={goToIssueList}
			rightAction={<IssueMenuButton onPress={goToIssueList} />}
			leftAction={<EditionsMenuButton onPress={handleEditionMenuPress} />}
			headerStyles={headerStyles}
		/>
	);
};

export { IssueScreenHeader };
