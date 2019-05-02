import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import IssueScreen from '../screens/IssueScreen';
import FrontScreen from '../screens/FrontScreen';
import ArticleScreen from '../screens/ArticleScreen';

const HomeStack = createStackNavigator(
	{
		Home: HomeScreen,
		Issue: IssueScreen,
		Front: FrontScreen,
		Article: ArticleScreen,
		Settings: SettingsScreen,
		Links: LinksScreen,
	},
	{
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: '#052962',
			},
			headerTintColor: '#fff',
		},
	}
);
export default createAppContainer(HomeStack);
