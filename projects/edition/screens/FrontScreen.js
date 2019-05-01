import React from 'react';
import { ScrollView, StyleSheet, Text, FlatList, Button } from 'react-native';

export default class FrontScreen extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.getParam('front', 'NO-ID'),
	});

	render() {
		const { navigation } = this.props;
		const issue = navigation.getParam('issue', 'NO-ID');
		const front = navigation.getParam('front', 'NO-ID');
		return (
			<ScrollView style={styles.container}>
				<Text>
					This is an FrontScreen for from {front}, issue {issue}
				</Text>
				<FlatList
					data={[{ key: 'otter' }, { key: 'brexit' }]}
					renderItem={({ item: { key } }) => (
						<Button
							onPress={() =>
								this.props.navigation.navigate('Article', {
									issue,
									front,
									article: key,
								})
							}
							title={key}
						/>
					)}
				/>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 15,
		backgroundColor: '#fff',
	},
});
