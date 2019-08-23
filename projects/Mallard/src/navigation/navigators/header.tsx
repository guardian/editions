import {
    NavigationContainer,
    NavigationInjectedProps,
    createStackNavigator,
    NavigationParams,
} from 'react-navigation'

import React from 'react'
import { Header } from 'src/components/layout/header/header'
import { Button } from 'src/components/button/button'
import { IssueTitle } from 'src/components/issue/issue-title'
import { addStaticRouter } from '../helpers/base'

interface NavigationOptions {
    title?: string
}

type NavOrFn =
    | (({ navigation }: { navigation: NavigationParams }) => NavigationOptions)
    | NavigationOptions

const getNavigationOptions = (
    navigation: NavigationParams,
    options: NavOrFn,
): NavigationOptions => {
    if (!options) return {}
    if (typeof options === 'function') {
        return options({ navigation })
    }
    return options
}
const addStaticRouterWithHeader = (
    Navigator: NavigationContainer,
): NavigationContainer => {
    const { router } = Navigator

    const WithHeader = ({ navigation }: NavigationInjectedProps) => {
        const component = router.getComponentForState(navigation.state)
        const options = getNavigationOptions(
            navigation,
            component.navigationOptions,
        )

        return (
            <>
                <Header
                    leftAction={
                        <Button
                            icon={'\uE00A'}
                            alt="Back"
                            onPress={() => navigation.goBack(null)}
                        ></Button>
                    }
                    layout={'center'}
                >
                    <IssueTitle
                        title={options.title || navigation.state.routeName}
                    />
                </Header>
                <Navigator navigation={navigation} />
            </>
        )
    }

    return addStaticRouter(Navigator, WithHeader)
}

const createHeaderStackNavigator = (
    routes: Parameters<typeof createStackNavigator>[0],
    options?: Parameters<typeof createStackNavigator>[1],
) =>
    addStaticRouterWithHeader(
        createStackNavigator(routes, { ...options, headerMode: 'none' }),
    )

export { createHeaderStackNavigator, addStaticRouterWithHeader }
