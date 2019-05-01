import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MonoTextBlock } from '../components/StyledText';
import { Transition } from 'react-navigation-fluid-transitions';
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
			<Transition shared={`item-${article}`}>
				<View style={styles.container}>
					<MonoTextBlock>
						This is an ArticleScreen for article {article}. from front {front},
						issue {issue}
					</MonoTextBlock>
				</View>
			</Transition>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		color: '#fff',
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#f0f',
	},
});
