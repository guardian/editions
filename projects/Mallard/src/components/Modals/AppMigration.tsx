import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { logEvent } from '../../helpers/analytics';
import { hasSeenAppMigrationMessage } from '../../helpers/storage';
import type { MainStackParamList } from '../../navigation/NavigationModels';
import { RouteNames } from '../../navigation/NavigationModels';
import { AppMigrationModalCard } from '../app-migration-modal-card';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';

const AppMigrationModal = () => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	return (
		<CenterWrapper>
			<AppMigrationModalCard
				onDismiss={() => {
					navigate(RouteNames.Issue);

					logEvent({
						name: 'app_migration_modal',
						value: 'app_migration_modal_dismissed',
					});
					hasSeenAppMigrationMessage.set(true);
				}}
			/>
		</CenterWrapper>
	);
};

export { AppMigrationModal };
