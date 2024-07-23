import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { AccessContext } from '../../authentication/AccessContext';
import { copy } from '../../helpers/words';
import type { MainStackParamList } from '../../navigation/NavigationModels';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';
import { MissingIAPModalCard } from '../missing-iap-modal-card';

const MissingIAPRestoreError = () => {
	const { authIAP } = useContext(AccessContext);
	const { goBack } =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	return (
		<CenterWrapper>
			<MissingIAPModalCard
				title={copy.alreadySubscribed.restoreErrorTitle}
				subtitle={copy.alreadySubscribed.restoreErrorSubtitle}
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
				title={copy.alreadySubscribed.restoreMissingTitle}
				subtitle={copy.alreadySubscribed.restoreMissingSubtitle}
				close={goBack}
				onTryAgain={authIAP}
			/>
		</CenterWrapper>
	);
};

export { MissingIAPRestoreError, MissingIAPRestoreMissing };
