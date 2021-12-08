import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { HeaderScreenContainer } from 'src/components/Header/Header';
import { ScrollContainer } from 'src/components/layout/ui/container';
import { Footer, Heading } from 'src/components/layout/ui/row';
import { List } from 'src/components/lists/list';
import { UiBodyCopy } from 'src/components/styled-text';
import { backends } from 'src/helpers/settings/defaults';
import { ENDPOINTS_HEADER_TITLE } from 'src/helpers/words';
import { API_URL_DEFAULT, useApiUrl } from 'src/hooks/use-config-provider';
import { color } from 'src/theme/color';
import { metrics } from 'src/theme/spacing';

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
	const navigation = useNavigation();

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
						title: (apiUrl === value ? '✅ ' : '') + title,
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
