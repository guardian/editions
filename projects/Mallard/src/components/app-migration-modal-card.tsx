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

const AppMigrationModalCard = ({ onDismiss }: { onDismiss: () => void }) => {
	return (
		<OnboardingCard
			onDismissThisCard={onDismiss}
			title={copy.appMigration.title}
			appearance={CardAppearance.Clashy}
			size="medium"
			bottomContent={
				<UiBodyCopy style={style.bodyCopy}>
					{copy.appMigration.body}
				</UiBodyCopy>
			}
		/>
	);
};

export { AppMigrationModalCard };
