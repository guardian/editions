import { useNavigation } from '@react-navigation/native';
import type {
	NativeStackNavigationProp,
	NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React from 'react';
import { Copy } from 'src/helpers/words';
import type { MainStackParamList } from 'src/navigation/NavigationModels';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';
import { CardAppearance, OnboardingCard } from '../onboarding/onboarding-card';

type SubFoundModalCardProps = NativeStackScreenProps<
	MainStackParamList,
	'SubFoundModal',
	'Main'
>;

const SubFoundModalCard = ({ route }: SubFoundModalCardProps) => {
	const { goBack } =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	return (
		<CenterWrapper>
			<OnboardingCard
				title={Copy.subFound.title}
				onDismissThisCard={() => {
					goBack();
					route.params?.closeAction?.();
				}}
				subtitle={Copy.subFound.subtitle}
				appearance={CardAppearance.Blue}
				size="small"
				bottomContent={<></>}
			/>
		</CenterWrapper>
	);
};

export { SubFoundModalCard };
