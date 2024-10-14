import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { logEvent } from '../../helpers/analytics';
import { hasSeenIapMigrationMessage } from '../../helpers/storage';
import type { MainStackParamList } from '../../navigation/NavigationModels';
import { RouteNames } from '../../navigation/NavigationModels';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';
import { IAPAppMigrationModalCard } from '../iap-app-migration-modal-card';

const IAPAppMigrationModal = () => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	return (
		<CenterWrapper>
			<IAPAppMigrationModalCard
				onDismiss={() => {
					navigate(RouteNames.Issue);

					logEvent({
						name: 'iap_app_migration_modal',
						value: 'iap_app_migration_modal_dismissed',
					});
					hasSeenIapMigrationMessage.set(true);
				}}
			/>
		</CenterWrapper>
	);
};

export { IAPAppMigrationModal };
