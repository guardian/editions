import { useNavigation, useNavigationState } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { SettingsOverlayContext } from 'src/hooks/use-settings-overlay';
import type { SettingsOverlayInterface } from 'src/hooks/use-settings-overlay';
import { RouteNames } from 'src/navigation/NavigationModels';
import { color } from 'src/theme/color';
import { Button } from '../Button/Button';
import { CloseButton } from '../Button/CloseButton';
import { IssueTitle } from '../issue/issue-title';
import { Header } from '../layout/header/header';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

const ModalStyles = StyleSheet.create({
	wrapper: {
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'center',
		flex: 1,
	},
	container: {
		height: isTablet() ? 600 : height,
		width: isTablet() ? 400 : width,
		borderRadius: 15,
		overflow: 'hidden',
		backgroundColor: color.background,
	},
});

const HeaderScreenContainer = ({
	actionLeft,
	actionRight = false,
	children,
	title,
}: {
	actionLeft: boolean;
	actionRight?: boolean;
	children: React.ReactNode;
	title: string;
}) => {
	const navigation = useNavigation();
	const { setSettingsModalOpen } = useContext(
		SettingsOverlayContext,
	) as SettingsOverlayInterface;
	const screenName = useNavigationState(
		(state) => state.routes[state.index].name,
	);

	return (
		<View style={ModalStyles.wrapper}>
			<View style={ModalStyles.container}>
				<Header
					leftAction={
						actionLeft ? (
							<Button
								icon={'\uE00A'}
								alt="Back"
								onPress={() => {
									if (screenName === RouteNames.Settings) {
										setSettingsModalOpen(false);
									}
									navigation.goBack();
								}}
							></Button>
						) : null
					}
					action={
						actionRight ? (
							<CloseButton
								accessibilityLabel={`Close the ${title} screen`}
								accessibilityHint="Closes the current screen"
								onPress={() => navigation.goBack()}
							/>
						) : null
					}
					layout={'center'}
				>
					<IssueTitle title={title} />
				</Header>
				{children}
			</View>
		</View>
	);
};

export { HeaderScreenContainer };
