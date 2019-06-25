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
/**
 *
 * @param Container - a NavigationContainer that we want to persist route changes between sessions
 * @param key - the key
 */
const withPersistenceKey = (
    Container: NavigationContainer,
    key: string | null,
) => {
    const Wrapper = (
        props: NavigationContainerProps & NavigationNavigatorProps<any>,
    ) => <Container {...props} persistenceKey={key} />
    Wrapper.router = Container.router
    return Wrapper
}

export { mapNavigationToProps, withPersistenceKey }
