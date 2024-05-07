import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import type { SpecialEditionHeaderStyles } from '../../../common';
import { CloseButton } from '../../../components/Button/CloseButton';
import { SettingsButton } from '../../../components/Button/SettingsButton';
import { IssueTitle } from '../../../components/issue/issue-title';
import { Header } from '../../../components/layout/header/header';
import { styles } from '../../../components/styled-text';
import { SettingsOverlayContext } from '../../../hooks/use-settings-overlay';
import type { MainStackParamList } from '../../../navigation/NavigationModels';
import { RouteNames } from '../../../navigation/NavigationModels';

const IssuePickerHeader = ({
	headerStyles,
	subTitle,
	title,
}: {
	headerStyles?: SpecialEditionHeaderStyles;
	subTitle?: string;
	title: string;
}) => {
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	const settingsOverlay = useContext(SettingsOverlayContext);

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
						settingsOverlay?.setSettingsModalOpen(true);
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
