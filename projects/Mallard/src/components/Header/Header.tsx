import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
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
		borderRadius: isTablet() ? 15 : 0,
		overflow: 'hidden',
		backgroundColor: color.background,
		flex: isTablet() ? 0 : 1,
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
