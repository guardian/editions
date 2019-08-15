import React, { ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
import {
    withNavigation,
    NavigationInjectedProps,
    createStackNavigator,
    NavigationContainer,
} from 'react-navigation'
import { WithBreakpoints } from 'src/components/layout/ui/with-breakpoints'
import { Breakpoints } from 'src/theme/breakpoints'
import { NavigationRouteConfigMap } from 'react-navigation'

const modalStyles = StyleSheet.create({
    root: {
        alignContent: 'stretch',
        justifyContent: 'center',
        alignItems: 'stretch',
        height: '100%',
        width: '100%',
        flex: 1,
        backgroundColor: 'rgba(52, 52, 52, .5)',
    },
    bleed: {
        flexGrow: 1,
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        height: '100%',
        width: '100%',
    },
    bg: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        width: 400,
        height: 600,
        backgroundColor: 'red',
    },
})

const ModalForTablet = ({ children }: { children: ReactNode }) => {
    return (
        <View style={modalStyles.root}>
            <WithBreakpoints>
                {{
                    [0]: () => (
                        <View style={modalStyles.bleed}>{children}</View>
                    ),
                    [Breakpoints.tabletVertical]: () => (
                        <View style={modalStyles.bg}>
                            <View style={modalStyles.modal}>{children}</View>
                        </View>
                    ),
                }}
            </WithBreakpoints>
        </View>
    )
}

const createModalNavigator = (routes: NavigationRouteConfigMap) => {
    const Navigator = createStackNavigator(routes)

    const WithModal = (withNavigation(
        ({ navigation }: NavigationInjectedProps) => {
            return (
                <ModalForTablet>
                    <Navigator navigation={navigation} />
                </ModalForTablet>
            )
        },
    ) as unknown) as NavigationContainer
    WithModal.router = Navigator.router
    return WithModal
}

export { createModalNavigator }
