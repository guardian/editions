import { useNavigation } from '@react-navigation/native';
import React from 'react';
import type { SpecialEditionHeaderStyles } from 'src/common';
import { CloseButton } from 'src/components/Button/CloseButton';
import { SettingsButton } from 'src/components/Button/SettingsButton';
import { IssueTitle } from 'src/components/issue/issue-title';
import { Header } from 'src/components/layout/header/header';
import { styles } from 'src/components/styled-text';
import { RouteNames } from 'src/navigation/NavigationModels';

const IssuePickerHeader = ({
	headerStyles,
	subTitle,
	title,
	navigation,
}: {
	headerStyles?: SpecialEditionHeaderStyles;
	subTitle?: string;
	title: string;
	navigation: any;
}) => {
	return (
		<Header
			alignment={'drawer'}
			onPress={() => navigation.goBack()}
			action={
				<CloseButton
					accessibilityLabel="Close button"
					accessibilityHint="Returns to the edition"
					onPress={() => navigation.goBack()}
				/>
			}
			leftAction={
				<SettingsButton
					onPress={() => {
						navigation.navigate(RouteNames.Settings);
					}}
				/>
			}
			headerStyles={headerStyles}
		>
			{title ? (
				<IssueTitle
					title={title}
					subtitle={subTitle}
					titleStyle={styles.issueLightText}
					overwriteStyles={headerStyles}
				/>
			) : null}
		</Header>
	);
};

export { IssuePickerHeader };
