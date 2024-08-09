import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { HeaderScreenContainer } from '../../components/Header/Header';
import { ScrollContainer } from '../../components/layout/ui/container';
import { Footer, Heading } from '../../components/layout/ui/row';
import { List } from '../../components/lists/list';
import { UiBodyCopy } from '../../components/styled-text';
import { backends } from '../../helpers/settings/defaults';
import { ENDPOINTS_HEADER_TITLE } from '../../helpers/words';
import { API_URL_DEFAULT, useApiUrl } from '../../hooks/use-config-provider';
import type { MainStackParamList } from '../../navigation/NavigationModels';
import { color } from '../../theme/color';
import { metrics } from '../../theme/spacing';

const ApiState = () => {
	const { apiUrl } = useApiUrl();
	if (apiUrl === API_URL_DEFAULT) return null;
	return (
		<Footer>
			<UiBodyCopy>
				{`API backend pointing to ${apiUrl}. This is not PROD!`}
			</UiBodyCopy>
		</Footer>
	);
};

const ApiScreen = () => {
	const { apiUrl, setApiUrl } = useApiUrl();
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();

	return (
		<HeaderScreenContainer title={ENDPOINTS_HEADER_TITLE} actionLeft={true}>
			<ScrollContainer>
				<Heading>Selected backend</Heading>
				<TextInput
					style={{
						padding: metrics.horizontal,
						paddingVertical: metrics.vertical * 2,
						backgroundColor: color.background,
						borderBottomColor: color.line,
						borderBottomWidth: StyleSheet.hairlineWidth,
					}}
					onChangeText={(value) => {
						if (value) {
							setApiUrl(value);
						}
					}}
					value={apiUrl ?? ''}
				/>
				<Heading>Presets</Heading>
				<List
					data={backends.map(({ title, value }) => ({
						title: `${apiUrl === value ? '✅ ' : ''}${title}`,
						explainer: value,
						key: value,
						onPress: () => {
							setApiUrl(value);
							navigation.goBack();
						},
					}))}
				/>
			</ScrollContainer>
		</HeaderScreenContainer>
	);
};
export { ApiScreen, ApiState };
