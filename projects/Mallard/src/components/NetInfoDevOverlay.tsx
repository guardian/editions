import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import * as React from 'react';
import {
	StyleSheet,
	Switch,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import {
	isDisconnectedState,
	NetInfoStateType,
	useNetInfo,
} from 'src/hooks/use-net-info-provider';

const devToggleStyles = StyleSheet.create({
	bg: {
		backgroundColor: 'black',
		padding: 8,
		borderRadius: 10,
		position: 'absolute',
		bottom: 20,
		left: 20,
		zIndex: 999999999,
	},
	contentContainer: {
		alignItems: 'center',
		backgroundColor: '#EEEEEE',
		flex: 1,
	},
	row: {
		flexDirection: 'row',
		padding: 10,
		justifyContent: 'space-between',
		maxWidth: 400,
		width: '100%',
	},
	text: {
		color: 'white',
	},
});

export const NetInfoDevOverlay = () => {
	// ref
	const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

	// variables
	const snapPoints = React.useMemo(() => ['50%', '50%'], []);

	// callbacks
	const handlePresentModalPress = React.useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const {
		type,
		isConnected,
		isPoorConnection,
		isInternetReachable,
		overrideIsConnected,
		setOverrideIsConnected,
		overrideNetworkType,
		setOverrideNetworkType,
		isDevButtonShown,
		overrideIsInternetReachable,
		setOverrideIsInternetReachable,
	} = useNetInfo();

	if (!isDevButtonShown) return null;

	return (
		<BottomSheetModalProvider>
			<>
				<View style={devToggleStyles.bg}>
					<TouchableWithoutFeedback
						onPress={() => {
							handlePresentModalPress();
						}}
					>
						<Text style={devToggleStyles.text}>
							Net info: {type} {'\n'}
							isConnected: {String(isConnected)} {'\n'}
							isPoorConnection: {String(isPoorConnection)} {'\n'}
							isInternetReachable: {String(isInternetReachable)}
						</Text>
					</TouchableWithoutFeedback>
				</View>
				<BottomSheetModal
					ref={bottomSheetModalRef}
					index={1}
					snapPoints={snapPoints}
				>
					<View style={devToggleStyles.contentContainer}>
						<View style={devToggleStyles.row}>
							<Text>Type: </Text>
							<Picker
								style={{
									flex: 1,
								}}
								selectedValue={overrideNetworkType}
								onValueChange={(itemValue) =>
									setOverrideNetworkType(itemValue)
								}
							>
								{(
									Object.keys(NetInfoStateType) as Array<
										keyof typeof NetInfoStateType
									>
								).map((type) => (
									<Picker.Item
										key={type}
										label={type}
										value={type}
									/>
								))}
							</Picker>
						</View>
						<View style={devToggleStyles.row}>
							<Text>isConnected: </Text>
							<Switch
								value={
									isDisconnectedState(overrideNetworkType)
										? false
										: overrideIsConnected
								}
								onValueChange={(val) =>
									setOverrideIsConnected(val)
								}
								disabled={isDisconnectedState(
									overrideNetworkType,
								)}
							/>
						</View>
						<View style={devToggleStyles.row}>
							<Text>isInternetReachable: </Text>
							<Switch
								value={
									isDisconnectedState(overrideNetworkType)
										? false
										: overrideIsInternetReachable
								}
								onValueChange={(val) =>
									setOverrideIsInternetReachable(val)
								}
								disabled={isDisconnectedState(
									overrideNetworkType,
								)}
							/>
						</View>
					</View>
				</BottomSheetModal>
			</>
		</BottomSheetModalProvider>
	);
};
