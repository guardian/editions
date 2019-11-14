import React from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { DefaultInfoTextWebview } from './settings/default-info-text-webview'
import { useApolloClient } from '@apollo/react-hooks'
import { metrics } from 'src/theme/spacing'
import { html } from 'src/helpers/webview'
import { setIsWeatherShown } from 'src/helpers/settings/setters'
import { Button, ButtonAppearance } from 'src/components/button/button'
import { requestLocationPermission } from 'src/helpers/location-permission'
import { RESULTS } from 'react-native-permissions'

const content = html`
    <p>
        This is a 3rd party service provided by AccuWeather. It works by taking
        your location coordinates and bringing the weather to you.
    </p>
    <ul>
        <li>
            The Daily app only collects your geolocation and Accuweather uses it
            for getting your weather forecast
        </li>
        <li>
            Your geolocation is not used for advertising or any other purposes
        </li>
        <li>
            Your geolocation is not linked to other identifiers such as your
            name or email address
        </li>
        <li>
            You can switch on/off your geolocation at any time on your app
            settings
        </li>
        </ul>
        <p>
            For more information about how Accuweather uses your location,
            please check their
            <a href="https://www.accuweather.com/en/privacy"> privacy policy</a>
        </p>
    </ul>
`

const styles = StyleSheet.create({
    button: {
        marginTop: metrics.vertical,
    },
    buttons: {
        marginHorizontal: metrics.horizontal,
        marginBottom: metrics.vertical * 2,
    },
})

const WeatherGeolocationConsentScreen = ({
    navigation,
}: NavigationInjectedProps) => {
    const apolloClient = useApolloClient()
    const onConsentPress = async () => {
        const result = await requestLocationPermission(apolloClient)
        if (result === RESULTS.BLOCKED) {
            Alert.alert(
                'Location permission',
                'Location permission has been blocked in the system ' +
                    'settings. Change the app-specific system setting to ' +
                    'enable location-based weather.',
            )
        }
        if (result === RESULTS.GRANTED) navigation.dismiss()
    }
    const onHidePress = () => {
        setIsWeatherShown(apolloClient, false)
        navigation.dismiss()
    }

    return (
        <>
            <DefaultInfoTextWebview html={content} />
            <View style={styles.buttons}>
                <Button
                    appearance={ButtonAppearance.skeletonBlue}
                    onPress={onConsentPress}
                    style={styles.button}
                >
                    Ok, show me the weather
                </Button>
                <Button
                    appearance={ButtonAppearance.skeletonBlue}
                    onPress={onHidePress}
                    style={styles.button}
                >
                    No thanks
                </Button>
            </View>
        </>
    )
}

WeatherGeolocationConsentScreen.navigationOptions = {
    title: 'Location-based weather',
    showHeaderLeft: false,
    showHeaderRight: true,
}

export { WeatherGeolocationConsentScreen }
