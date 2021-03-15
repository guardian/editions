import { useNavigation } from '@react-navigation/native';
import React from 'react';
import type { SpecialEditionHeaderStyles } from 'src/common';
import { CloseButton } from 'src/components/Button/CloseButton';
import { SettingsButton } from 'src/components/Button/SettingsButton';
import { navigateToSettings } from 'src/navigation/helpers/base';
import { ScreenHeader } from '../ScreenHeader';

const IssuePickerHeader = ({
	headerStyles,
	subTitle,
	title,
}: {
	headerStyles?: SpecialEditionHeaderStyles;
	subTitle?: string;
	title: string;
}) => {
	const navigation = useNavigation();
	return (
		<ScreenHeader
			leftAction={
				<SettingsButton
					onPress={() => {
						navigateToSettings(navigation);
					}}
				/>
			}
			onPress={() => navigation.goBack()}
			rightAction={
				<CloseButton
					accessibilityLabel="Close button"
					accessibilityHint="Returns to the edition"
					onPress={() => navigation.goBack()}
				/>
			}
			title={title}
			subTitle={subTitle}
			headerStyles={headerStyles}
		/>
	);
};

export { IssuePickerHeader };
