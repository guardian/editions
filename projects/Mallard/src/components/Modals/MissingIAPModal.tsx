import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { AccessContext } from 'src/authentication/AccessContext';
import { Copy } from 'src/helpers/words';
import type { MainStackParamList } from 'src/navigation/NavigationModels';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';
import { MissingIAPModalCard } from '../missing-iap-modal-card';

const MissingIAPRestoreError = () => {
	const { authIAP } = useContext(AccessContext);
	const { goBack } =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	return (
		<CenterWrapper>
			<MissingIAPModalCard
				title={Copy.alreadySubscribed.restoreErrorTitle}
				subtitle={Copy.alreadySubscribed.restoreErrorSubtitle}
				close={goBack}
				onTryAgain={authIAP}
			/>
		</CenterWrapper>
	);
};

const MissingIAPRestoreMissing = () => {
	const { authIAP } = useContext(AccessContext);
	const { goBack } =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	return (
		<CenterWrapper>
			<MissingIAPModalCard
				title={Copy.alreadySubscribed.restoreMissingTitle}
				subtitle={Copy.alreadySubscribed.restoreMissingSubtitle}
				close={goBack}
				onTryAgain={authIAP}
			/>
		</CenterWrapper>
	);
};

export { MissingIAPRestoreError, MissingIAPRestoreMissing };
