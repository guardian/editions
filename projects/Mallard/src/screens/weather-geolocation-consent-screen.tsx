import React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { DefaultInfoTextWebview } from './settings/default-info-text-webview'
import { Button, ButtonAppearance } from 'src/components/button/button'
import { html } from 'src/helpers/webview'
import { requestLocationPermission } from 'src/helpers/location-permission'
import { useApolloClient } from '@apollo/react-hooks'
import { RESULTS } from 'react-native-permissions'
import { setWeatherVisibility } from 'src/helpers/weather-visibility'
import { metrics } from 'src/theme/spacing'

const content = html`
    <h2>Location-based weather</h2>
    <p>
        This is 3rd party service provided by AccuWeather. It works by taking
        your geolocation and bringing the weather to you.
    </p>
    <ul>
        <li>
            The Guardian app only collects your geolocation and Accuweather uses
            it for getting your weather forecast
        </li>
        <li>
            Your geolocation is not used for advertising or any other purposes
        </li>
        <li>
            Your geolocation is not linked to other identifiers such as your
            name or email address
        </li>
        <li>
            You can switch off your geolocation at any time on your device
            settings
        </li>
        <li>
            For more information about how Accuweather uses your location,
            please check their
            <a href="https://www.accuweather.com/en/privacy"> privacy policy</a>
        </li>
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
        if (result != RESULTS.DENIED) {
            navigation.dismiss()
        }
    }
    const onHidePress = () => {
        setWeatherVisibility(apolloClient, 'hidden')
        navigation.dismiss()
    }

    return (
        <>
            <DefaultInfoTextWebview html={content} />
            <View style={styles.buttons}>
                <Button onPress={onConsentPress} style={styles.button}>
                    I understand and consent
                </Button>
                <Button
                    appearance={ButtonAppearance.skeleton}
                    onPress={onHidePress}
                    style={styles.button}
                >
                    Hide the weather
                </Button>
            </View>
        </>
    )
}

WeatherGeolocationConsentScreen.navigationOptions = {
    title: 'Set Location',
    showHeaderLeft: false,
    showHeaderRight: true,
}

export { WeatherGeolocationConsentScreen }
