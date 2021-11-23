import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { RightChevron } from 'src/components/icons/RightChevron';
import { Row, Separator } from 'src/components/layout/ui/row';
import { UiBodyCopy } from 'src/components/styled-text';
import { JOIN_BETA_LINK } from 'src/constants';
import { isInBeta } from 'src/helpers/release-stream';
import { Copy } from 'src/helpers/words';
import type { SettingsStackParamList } from 'src/navigation/NavigationModels';
import { RouteNames } from 'src/navigation/NavigationModels';
import { remoteConfigService } from 'src/services/remote-config';
import { metrics } from 'src/theme/spacing';

const betaButtonStyle = StyleSheet.create({
	thanksText: {
		marginTop: metrics.vertical,
		marginLeft: metrics.horizontal,
	},
});

const betaProgrammeFAQs = (
	navigation: StackNavigationProp<SettingsStackParamList>,
) => ({
	key: 'Beta Programme FAQs',
	title: Copy.settings.betaProgrammeFAQs,
	onPress: () => {
		navigation.navigate(RouteNames.BetaProgrammeFAQs);
	},
	proxy: <RightChevron />,
});

const betaThanks = () => {
	const navigation =
		useNavigation<StackNavigationProp<SettingsStackParamList>>();
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
	const navigation =
		useNavigation<StackNavigationProp<SettingsStackParamList>>();
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
