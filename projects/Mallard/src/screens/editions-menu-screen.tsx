import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import React from 'react';
import {
	Dimensions,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { EditionsMenu } from '../components/EditionsMenu/EditionsMenu';
import { EditionsMenuScreenHeader } from '../components/ScreenHeader/EditionMenuScreenHeader';
import { logEvent } from '../helpers/analytics';
import { useEditions } from '../hooks/use-edition-provider';
import type { MainStackParamList } from '../navigation/NavigationModels';
import { RouteNames } from '../navigation/NavigationModels';
import { WithAppAppearance } from '../theme/appearance';
import { ApiState } from './settings/api-screen';

const sidebarWidth = 360;

export const ScreenFiller = ({
	direction,
	children,
}: {
	direction?: string;
	children: ReactElement;
}) => {
	const navigation = useNavigation();

	const styles = StyleSheet.create({
		container: {
			display: 'flex',
			justifyContent: 'flex-end',
			flexDirection: 'row-reverse',
		},
		touchable: {
			backgroundColor: 'transparent',
			height: Dimensions.get('window').height,
			width: Dimensions.get('window').width - sidebarWidth,
		},
		screenFiller: {
			flex: 1,
			backgroundColor: 'white',
			maxWidth: DeviceInfo.isTablet() ? sidebarWidth : undefined,
		},
	});

	return (
		<View
			style={[
				styles.container,
				{
					flexDirection: direction === 'end' ? 'row' : 'row-reverse',
				},
			]}
		>
			{DeviceInfo.isTablet() && (
				<TouchableWithoutFeedback onPress={navigation.goBack}>
					<View style={styles.touchable} />
				</TouchableWithoutFeedback>
			)}

			<View
				style={[
					styles.screenFiller,
					direction === 'end' && { alignSelf: 'flex-end' },
				]}
			>
				{children}
			</View>
		</View>
	);
};

export const EditionsMenuScreen = () => {
	const {
		editionsList: { regionalEditions, specialEditions },
		selectedEdition,
		storeSelectedEdition,
	} = useEditions();
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	return (
		<WithAppAppearance value="default">
			<ScreenFiller>
				<>
					<EditionsMenuScreenHeader
						leftActionPress={() => {
							navigation.navigate(RouteNames.Issue);
							logEvent({
								name: 'editions_menu_button',
								value: 'editions_menu_button_closed',
							});
						}}
					/>

					<EditionsMenu
						navigationPress={() =>
							navigation.navigate(RouteNames.Issue)
						}
						regionalEditions={regionalEditions}
						specialEditions={specialEditions}
						selectedEdition={selectedEdition.edition}
						storeSelectedEdition={storeSelectedEdition}
					/>
					<ApiState />
				</>
			</ScreenFiller>
		</WithAppAppearance>
	);
};
