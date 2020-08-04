import React, { useState, useEffect } from 'react'
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
import { Copy } from 'src/helpers/words'
import { fetchEditionMenuEnabledSetting } from 'src/helpers/settings/debug'

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
        Copy.weather.disabledLocationAlertTitle,
        Copy.weather.disabledLocationAlertExplainer,
    )
}

const WeatherGeolocationConsentScreen = ({
    navigation,
}: NavigationInjectedProps) => {
    const [editionsMenuEnabled, setEditionsMenuEnabled] = useState(false)
    const apolloClient = useApolloClient()
    const onConsentPress = async () => {
        const result = await requestLocationPermission(apolloClient)
        if (result === RESULTS.BLOCKED) {
            Alert.alert(
                Copy.weather.locationPermissionTitle,
                Copy.weather.locationPermissionExplainer,
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

    useEffect(() => {
        fetchEditionMenuEnabledSetting().then((editionsMenuToggle: boolean) => {
            setEditionsMenuEnabled(editionsMenuToggle)
        })
    }, [])

    return (
        <>
            <DefaultInfoTextWebview
                html={html`
                    ${editionsMenuEnabled
                        ? Copy.weatherConsentHtml.contentEditions
                        : Copy.weatherConsentHtml.contentDaily}
                `}
            />
            <View style={styles.buttons}>
                <Button
                    appearance={ButtonAppearance.skeletonBlue}
                    onPress={onConsentPress}
                    style={styles.button}
                >
                    {Copy.weather.acceptLocationButton}
                </Button>
                <Button
                    appearance={ButtonAppearance.skeletonBlue}
                    onPress={onHidePress}
                    style={styles.button}
                >
                    {Copy.weather.cancelButton}
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
