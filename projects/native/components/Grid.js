import React from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { Transition } from 'react-navigation-fluid-transitions';

export default class Grid extends React.Component {
	render() {
		const { data, navigation, to } = this.props;
		return (
			<FlatList
				numColumns={2}
				style={{
					background: '#f00',
					borderColor: '#ddd',
					margin: 8,
				}}
				data={data}
				renderItem={({ item: { title, ...item } }) => (
					<TouchableOpacity
						style={{
							flex: 1,
						}}
						onPress={() => navigation.navigate(to, item)}
					>
						<View style={{ backgroundColor: '#fff' }}>
							<Transition shared={`item-${item.key}`}>
								<View
									style={{
										flex: 1,
										height: 100,
										backgroundColor: '#f0f',
										margin: 8,
										padding: 16,
									}}
								>
									<Text>{title || 'no title'}</Text>
								</View>
							</Transition>
						</View>
					</TouchableOpacity>
				)}
			/>
		);
	}
}
