import React from 'react'
import {
    NavigationScreenProp,
    NavigationNavigatorProps,
} from 'react-navigation'
import { NavigationContainerProps } from 'react-navigation'
import { NavigationContainer } from 'react-navigation'

/**
 *
 * @param Component - component that doesn't want to have navigation as a dependency
 * @param mapper - function to generate props from navigation
 *
 * Much like `mapDispatchToProps` in `redux`. Means we can decouple out components from navigation.
 */
const mapNavigationToProps = <T extends {}, P extends {}>(
    Component: React.ComponentType<T>,
    mapper: (navigation: NavigationScreenProp<P>) => Partial<T>,
) => (props: T & { navigation: NavigationScreenProp<P> }) => (
    <Component {...props} {...mapper(props.navigation)} />
)

export { mapNavigationToProps }
