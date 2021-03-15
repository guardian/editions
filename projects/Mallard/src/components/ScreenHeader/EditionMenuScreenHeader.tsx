import React from 'react';
import { EditionsMenuButton } from 'src/components/EditionsMenu/EditionsMenuButton/EditionsMenuButton';
import { IssueTitle } from 'src/components/issue/issue-title';
import { Header } from '../layout/header/header';

export const EditionsMenuScreenHeader = ({
	leftActionPress,
}: {
	leftActionPress: () => void;
}) => (
	<Header
		leftAction={<EditionsMenuButton selected onPress={leftActionPress} />}
		layout={'center'}
	>
		<IssueTitle title={`Editions`} />
	</Header>
);
