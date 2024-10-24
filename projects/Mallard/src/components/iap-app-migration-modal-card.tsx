import React from 'react';
import { StyleSheet } from 'react-native';
import { copy } from '../helpers/words';
import { color } from '../theme/color';
import { CardAppearance, OnboardingCard } from './onboarding/onboarding-card';
import { UiBodyCopy } from './styled-text';

const style = StyleSheet.create({
	bodyCopy: {
		color: color.palette.neutral[100],
	},
});

const IAPAppMigrationModalCard = ({ onDismiss }: { onDismiss: () => void }) => {
	return (
		<OnboardingCard
			onDismissThisCard={onDismiss}
			title={copy.iAPMigration.title}
			appearance={CardAppearance.Clashy}
			size="medium"
			bottomContent={
				<UiBodyCopy style={style.bodyCopy}>
					{copy.iAPMigration.body}
				</UiBodyCopy>
			}
		/>
	);
};

export { IAPAppMigrationModalCard };
