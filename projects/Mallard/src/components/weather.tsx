import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { useCachedOrPromise } from 'src/hooks/use-cached-or-promise'
import { withResponse } from 'src/helpers/response'
import { Forecast } from '../common'
import { metrics } from 'src/theme/spacing'
import { WeatherIcon } from './weather/weatherIcon'
import Moment from 'moment'
import { fetchWeather } from 'src/helpers/fetch'

const styles = StyleSheet.create({
    weatherContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: 'auto',
        height: 60,
        paddingLeft: metrics.horizontal,
        paddingRight: metrics.horizontal,
    },
    forecastItem: {
        flex: 2,
        height: 'auto',
        borderLeftWidth: 1,
        borderLeftColor: '#BDBDBD',
        borderStyle: 'solid',
        borderColor: '#BDBDBD',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 10,
        paddingTop: 2,
    },
    temperature: {
        color: '#E05E00',
        fontSize: 13,
        fontFamily: 'GuardianTextSans-Regular',
        lineHeight: 13,
    },
    dateTime: {
        color: '#000000',
        fontSize: 13,
        fontFamily: 'GuardianTextSans-Regular',
        lineHeight: 13,
    },
    locationNameContainer: {
        flex: 7.5,
        height: 60,
        flexDirection: 'row',
    },
    locationName: {
        fontFamily: 'GuardianTextSans-Regular',
        fontSize: 13,
        color: '#000000',
        lineHeight: 35,
    },
    locationPinIcon: {
        fontFamily: 'GuardianIcons-Regular',
        fontSize: 30,
        color: '#ACACAC',
    },
    root: {
        fontFamily: 'weather',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flex: 0,
        width: 'auto',
    },
})

/**
 * In future iterations we will use the device to access the user's lat/lon co-ordinates
 * and make a request to http://mobile-weather.guardianapis.com/locations/v1/cities/geoposition/search?q=$LAT,$LON
 * in order to fetch a more specific location code to make the below request. This will require permission from the user
 * to use their location.
 */

const useWeatherResponse = () => {
    const londonLocationCode = 328328
    return withResponse<Forecast[]>(
        useCachedOrPromise(
            fetchWeather<Forecast[]>(
                `forecasts/v1/hourly/12hour/${londonLocationCode}.json?metric=true&language=en-gb`,
            ),
        ),
    )
}

const Weather = () => {
    let weatherResponse = useWeatherResponse()

    const renderWeather = (forecasts: Forecast[]) => {
        if (forecasts && forecasts.length >= 9) {
            return (
                <View style={styles.weatherContainer}>
                    <View style={styles.locationNameContainer}>
                        <Text style={styles.locationPinIcon}>{'\uE01B'}</Text>
                        <Text style={styles.locationName}>{'London'}</Text>
                    </View>
                    {/*Get the hourly forecast in 2 hour intervals from the 12 hour forecast.*/}
                    {[0, 2, 4, 6, 8].map(idx => {
                        return (
                            <View style={styles.forecastItem} key={idx}>
                                <WeatherIcon
                                    iconNumber={forecasts[idx].WeatherIcon}
                                    fontSize={30}
                                />
                                <Text style={styles.temperature}>
                                    {Math.round(
                                        forecasts[idx].Temperature.Value,
                                    ) +
                                        ' ' +
                                        forecasts[idx].Temperature.Unit}
                                </Text>
                                <Text style={styles.dateTime}>
                                    {Moment(forecasts[idx].DateTime).format(
                                        'h a',
                                    )}
                                </Text>
                            </View>
                        )
                    })}
                </View>
            )
        }

        return <></>
    }

    return weatherResponse({
        error: ({ message }) => <></>,
        pending: () => <></>,
        success: forecasts => renderWeather(forecasts),
    })
}

export { Weather }
