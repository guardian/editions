import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { RightChevron } from '../../components/icons/RightChevron';
import { Row, Separator } from '../../components/layout/ui/row';
import { UiBodyCopy } from '../../components/styled-text';
import { JOIN_BETA_LINK } from '../../constants';
import { isInBeta } from '../../helpers/release-stream';
import { copy } from '../../helpers/words';
import type { MainStackParamList } from '../../navigation/NavigationModels';
import { RouteNames } from '../../navigation/NavigationModels';
import { remoteConfigService } from '../../services/remote-config';
import { metrics } from '../../theme/spacing';

const betaButtonStyle = StyleSheet.create({
	thanksText: {
		marginTop: metrics.vertical,
		marginLeft: metrics.horizontal,
	},
});

const betaProgrammeFAQs = (
	navigation: StackNavigationProp<MainStackParamList>,
) => ({
	key: 'Beta Programme FAQs',
	title: copy.settings.betaProgrammeFAQs,
	onPress: () => {
		navigation.navigate(RouteNames.BetaProgrammeFAQs);
	},
	proxy: <RightChevron />,
});

const betaThanks = () => {
	const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
	return (
		<>
			<Separator />
			<Row {...betaProgrammeFAQs(navigation)} />
			<Separator />
			<UiBodyCopy style={betaButtonStyle.thanksText}>
				Thank you for being a beta tester 🙌
			</UiBodyCopy>
		</>
	);
};

const joinBetaMenuButton = () => {
	const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
	return (
		<>
			<Separator />
			<Row
				title="Become a beta tester 🙌"
				onPress={() => Linking.openURL(JOIN_BETA_LINK)}
				proxy={<RightChevron />}
			/>
			<Separator />
			<Row {...betaProgrammeFAQs(navigation)} />
		</>
	);
};

const BetaButtonOption = () => {
	if (remoteConfigService.getBoolean('join_beta_button_enabled')) {
		return isInBeta() ? betaThanks() : joinBetaMenuButton();
	} else {
		return <></>;
	}
};

export { BetaButtonOption };
