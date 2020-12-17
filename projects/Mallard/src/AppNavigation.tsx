import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { routeNames } from './navigation/routes'
import { HomeScreen } from './screens/home-screen'
import { IssueScreen } from './screens/issue-screen'
import { EditionsMenuScreen } from './screens/editions-menu-screen'

const Stack = createStackNavigator()

const RootStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ gestureEnabled: false, headerShown: false }}
        >
            <Stack.Screen
                name={routeNames.Issue}
                component={IssueScreen}
                options={{}}
            />
            <Stack.Screen name={routeNames.IssueList} component={HomeScreen} />
            <Stack.Screen
                name={routeNames.EditionsMenu}
                component={EditionsMenuScreen}
            />
        </Stack.Navigator>
    )
}

export { RootStack }
