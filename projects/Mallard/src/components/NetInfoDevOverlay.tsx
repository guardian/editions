import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import gql from 'graphql-tag';
import * as React from 'react';
import {
	StyleSheet,
	Switch,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { useQuery } from 'src/hooks/apollo';
import { isDisconnectedState, NetInfoStateType } from 'src/hooks/use-net-info';
import type { NetInfo } from 'src/hooks/use-net-info';

const DevButton = (() => {
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

	type QueryValue = {
		netInfo: Pick<
			NetInfo,
			| 'type'
			| 'isConnected'
			| 'isPoorConnection'
			| 'isInternetReachable'
			| 'isDevButtonShown'
			| 'overrideIsConnected'
			| 'setOverrideIsConnected'
			| 'overrideNetworkType'
			| 'setOverrideNetworkType'
			| 'overrideIsInternetReachable'
			| 'setOverrideIsInternetReachable'
		>;
	};
	const QUERY = gql`
		{
			netInfo @client {
				type @client
				isConnected @client
				isPoorConnection @client
				isInternetReachable @client
				isDevButtonShown @client
				overrideIsConnected @client
				setOverrideIsConnected @client
				overrideNetworkType @client
				setOverrideNetworkType @client
				overrideIsInternetReachable @client
				setOverrideIsInternetReachable @client
			}
		}
	`;

	return () => {
		// ref
		const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

		// variables
		const snapPoints = React.useMemo(() => ['50%', '50%'], []);

		// callbacks
		const handlePresentModalPress = React.useCallback(() => {
			bottomSheetModalRef.current?.present();
		}, []);
		const handleSheetChanges = React.useCallback((index: number) => {
			console.log('handleSheetChanges', index);
		}, []);

		const res = useQuery<QueryValue>(QUERY);
		if (res.loading) return null;

		const {
			netInfo: {
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
			},
		} = res.data;

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
								isPoorConnection: {String(
									isPoorConnection,
								)}{' '}
								{'\n'}
								isInternetReachable:{' '}
								{String(isInternetReachable)}
							</Text>
						</TouchableWithoutFeedback>
					</View>
					<BottomSheetModal
						ref={bottomSheetModalRef}
						index={1}
						snapPoints={snapPoints}
						onChange={handleSheetChanges}
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
									{(Object.keys(NetInfoStateType) as Array<
										keyof typeof NetInfoStateType
									>).map((type) => (
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
})();

/**
 * Display an overlay on top of the App that allows simulating being
 * off-network. Similar to "aeroplane mode", but just for the app and without
 * preventing React Native reloads. (also there is no aeroplane mode in iOS
 * emulator so this is quite convenient).
 */
export const NetInfoDevOverlay = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<>
			{children}
			<DevButton />
		</>
	);
};
