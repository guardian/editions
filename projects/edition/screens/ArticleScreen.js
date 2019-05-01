import React from 'react';
import { ScrollView, StyleSheet, Text, FlatList, Button } from 'react-native';

export default class ArticleScreen extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.getParam('article', 'NO-ID'),
	});

	render() {
		const { navigation } = this.props;
		const issue = navigation.getParam('issue', 'NO-ID');
		const front = navigation.getParam('front', 'NO-ID');
		const article = navigation.getParam('article', 'NO-ID');
		return (
			<ScrollView style={styles.container}>
				<Text>
					This is an ArticleScreen for article {article}. from front {front},
					issue {issue}
				</Text>
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
