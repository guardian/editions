import { useNavigation } from '@react-navigation/native';
import type { ReactElement } from 'react';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { EditionsMenu } from 'src/components/EditionsMenu/EditionsMenu';
import { EditionsMenuScreenHeader } from 'src/components/ScreenHeader/EditionMenuScreenHeader';
import { useEditions } from 'src/hooks/use-edition-provider';
import { RouteNames } from 'src/navigation/NavigationModels';
import { WithAppAppearance } from 'src/theme/appearance';
import { ApiState } from './settings/api-screen';

const sidebarWidth = 360;

const styles = StyleSheet.create({
	screenFiller: {
		flex: 1,
		backgroundColor: 'white',
		maxWidth: DeviceInfo.isTablet() ? sidebarWidth : undefined,
	},
});

export const ScreenFiller = ({
	direction,
	children,
}: {
	direction?: string;
	children: ReactElement;
}) => (
	<View
		style={[
			styles.screenFiller,
			direction === 'end' && { alignSelf: 'flex-end' },
		]}
	>
		{children}
	</View>
);

export const EditionsMenuScreen = () => {
	const {
		editionsList: { regionalEditions, specialEditions },
		selectedEdition,
		storeSelectedEdition,
	} = useEditions();
	const navigation = useNavigation();
	return (
		<WithAppAppearance value="default">
			<ScreenFiller>
				<>
					<EditionsMenuScreenHeader
						leftActionPress={() =>
							navigation.navigate(RouteNames.Issue)
						}
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
