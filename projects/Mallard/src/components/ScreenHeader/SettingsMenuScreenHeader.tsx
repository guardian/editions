import React from 'react';
import { StyleSheet } from 'react-native';
import { EditionsMenuButton } from 'src/components/EditionsMenu/EditionsMenuButton/EditionsMenuButton';
import { IssueTitle } from 'src/components/issue/issue-title';
import { CloseButton } from '../Button/CloseButton';
import { Header } from '../layout/header/header';

const styles = StyleSheet.create({
	title: { paddingLeft: 100, alignSelf: 'flex-start' },
});

export const SettingsMenuScreenHeader = ({
	rightActionPress,
}: {
	rightActionPress: () => void;
}) => (
	<Header
		action={
			<CloseButton
				accessibilityLabel="Close the current screen"
				accessibilityHint="Closes the current screen"
				onPress={rightActionPress}
			/>
		}
		layout={'center'}
	>
		<IssueTitle title="Settings" style={styles.title} />
	</Header>
);
