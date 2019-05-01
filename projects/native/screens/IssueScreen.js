import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import List from '../components/List';
import { MonoTextBlock } from '../components/StyledText';
export default class IssueScreen extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.getParam('issue', 'NO-ID'),
	});

	render() {
		const { navigation } = this.props;
		const issue = navigation.getParam('issue', 'NO-ID');
		return (
			<ScrollView style={styles.container}>
				<List
					to="Front"
					data={[
						{
							issue,
							front: 'news',
							key: 'news',
							title: 'News front',
						},
						{
							issue,
							front: 'sport',
							key: 'sport',
							title: 'Sport front',
						},
					]}
					{...{ navigation }}
				/>
				<MonoTextBlock>This is an IssueScreen for issue {issue}</MonoTextBlock>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
