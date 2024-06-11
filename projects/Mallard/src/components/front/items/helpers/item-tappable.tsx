import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ReactNode } from 'react';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import type { CAPIArticle, Issue, ItemSizes } from 'src/common';
import type { MainStackParamList } from 'src/navigation/NavigationModels';
import { RouteNames } from 'src/navigation/NavigationModels';
import type { PathToArticle } from 'src/paths';
import type { ArticleNavigator } from 'src/screens/article-screen';
import { metrics } from 'src/theme/spacing';
import { useCardBackgroundStyle } from '../../helpers/helpers';

interface TappablePropTypes {
	style?: StyleProp<ViewStyle>;
	article: CAPIArticle;
	path: PathToArticle;
	articleNavigator: ArticleNavigator;
}

export interface PropTypes extends TappablePropTypes {
	size: ItemSizes;
	localIssueId: Issue['localId'];
	publishedIssueId: Issue['publishedId'];
}

/*
TAPPABLE
This just wraps every card to make it tappable
*/
export const tappablePadding = {
	padding: metrics.horizontal / 2,
	paddingVertical: metrics.vertical / 2,
};
const tappableStyles = StyleSheet.create({
	root: {
		flexGrow: 1,
		flexShrink: 0,
		flexBasis: '100%',
	},
	padding: tappablePadding,
});

const ItemTappable = ({
	children,
	articleNavigator,
	style,
	article,
	path,
	hasPadding = true,
}: {
	children: ReactNode;
	hasPadding?: boolean;
} & TappablePropTypes) => {
	const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

	const handlePress = () => {
		article.type === 'crossword'
			? navigation.navigate(RouteNames.Crossword, {
					path,
					articleNavigator,
					prefersFullScreen: true,
			  })
			: navigation.navigate(RouteNames.Article, {
					path,
					articleNavigator,
			  });
	};

	return (
		<View style={[style]}>
			<TouchableHighlight onPress={handlePress} activeOpacity={0.95}>
				<View
					style={[
						tappableStyles.root,
						hasPadding && tappableStyles.padding,
						useCardBackgroundStyle(),
					]}
				>
					{children}
				</View>
			</TouchableHighlight>
		</View>
	);
};

export { ItemTappable };
