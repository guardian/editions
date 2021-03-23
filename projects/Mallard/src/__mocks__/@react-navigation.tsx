import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// https://medium.com/@dariaruckaolszaska/testing-your-react-navigation-5-hooks-b8b8f745e5b6
const Stack = createStackNavigator();
const MockedNavigator = ({ component, params = {}, props }: any) => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="MockedScreen"
					component={component}
					initialParams={params}
					{...props}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default MockedNavigator;
