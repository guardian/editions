import React from 'react';
import { ScrollView, StyleSheet, Text, FlatList, Button } from 'react-native';

export default class IssueScreen extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.getParam('issue', 'NO-ID'),
	});

	render() {
		const { navigation } = this.props;
		const issue = navigation.getParam('issue', 'NO-ID');
		return (
			<ScrollView style={styles.container}>
				<Text>This is an IssueScreen for issue {issue}</Text>
				<FlatList
					data={[{ key: 'news' }, { key: 'sports' }]}
					renderItem={({ item: { key } }) => (
						<Button
							onPress={() =>
								this.props.navigation.navigate('Front', { issue, front: key })
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
