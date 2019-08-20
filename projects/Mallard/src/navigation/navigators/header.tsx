import {
    NavigationContainer,
    NavigationInjectedProps,
    createStackNavigator,
    NavigationParams,
} from 'react-navigation'

import React from 'react'
import { Header } from 'src/components/layout/header/header'
import { Button } from 'src/components/button/button'

interface NavigationOptions {
    title?: string
}

type NavOrFn =
    | ((navigation: NavigationParams) => NavigationOptions)
    | NavigationOptions

const getNavigationOptions = (
    navigation: NavigationParams,
    options: NavOrFn,
): NavigationOptions => {
    if (!options) return {}
    if (typeof options === 'function') {
        return options(navigation)
    }
    return options
}
const wrapNavigatorWithHeader = (
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
                    title={options.title || navigation.state.routeName}
                ></Header>
                <Navigator navigation={navigation} />
            </>
        )
    }
    WithHeader.router = router

    return (WithHeader as unknown) as NavigationContainer
}

const createHeaderStackNavigator = (
    routes: Parameters<typeof createStackNavigator>[0],
    options?: Parameters<typeof createStackNavigator>[1],
) =>
    wrapNavigatorWithHeader(
        createStackNavigator(routes, { ...options, headerMode: 'none' }),
    )

export { createHeaderStackNavigator }
