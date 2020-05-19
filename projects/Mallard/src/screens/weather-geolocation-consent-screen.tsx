import React from 'react'
import { StyleSheet, View, Alert, Platform, Linking } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { DefaultInfoTextWebview } from './settings/default-info-text-webview'
import { useApolloClient } from '@apollo/react-hooks'
import { metrics } from 'src/theme/spacing'
import { html } from 'src/helpers/webview'
import { setIsWeatherShown } from 'src/helpers/settings/setters'
import { Button, ButtonAppearance } from 'src/components/Button/Button'
import { requestLocationPermission } from 'src/helpers/location-permission'
import { RESULTS } from 'react-native-permissions'
import { getGeolocation } from 'src/helpers/weather'

const content = html`
    <h2>Location-based weather</h2>
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
            You can switch the weather feature on/off at any time on the app
            Settings
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
        marginBottom:
            metrics.vertical * Platform.select({ default: 2, ios: 4 }),
    },
})

const showIsDisabledAlert = () => {
    Alert.alert(
        'Location services',
        'Location services are disabled in the device ' +
            'settings. Enable them to see location-based ' +
            'weather.',
    )
}

const WeatherGeolocationConsentScreen = ({
    navigation,
}: NavigationInjectedProps) => {
    const apolloClient = useApolloClient()
    const onConsentPress = async () => {
        const result = await requestLocationPermission(apolloClient)
        if (result === RESULTS.BLOCKED) {
            Alert.alert(
                'Location permission',
                'Location permission is blocked in the device ' +
                    'settings. Allow the app to access location to ' +
                    'see location-based weather.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            Linking.openSettings()
                        },
                    },
                ],
            )
            return
        }
        if (result === RESULTS.UNAVAILABLE) {
            showIsDisabledAlert()
            return
        }
        if (result === RESULTS.GRANTED) {
            try {
                await getGeolocation()
            } catch (error) {
                showIsDisabledAlert()
                return
            }
            navigation.dismiss()
        }
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
    title: ' ',
    showHeaderLeft: false,
    showHeaderRight: true,
}

export { WeatherGeolocationConsentScreen }
