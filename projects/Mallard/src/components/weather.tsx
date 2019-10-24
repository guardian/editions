import React from 'react'
import { Text, StyleSheet, View, StyleProp, ViewStyle } from 'react-native'
import { Forecast } from '../common'
import { metrics } from 'src/theme/spacing'
import { WeatherIcon } from './weather/weatherIcon'
import Moment from 'moment'
import { GridRowSplit } from './issue/issue-title'
import { color } from 'src/theme/color'
import { getFont } from 'src/theme/typography'
import { WithBreakpoints } from './layout/ui/sizing/with-breakpoints'
import { Breakpoints } from 'src/theme/breakpoints'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Button, ButtonAppearance } from './button/button'
import { RESULTS } from 'react-native-permissions'
import { requestLocationPermission } from 'src/helpers/location-permission'

const narrowSpace = String.fromCharCode(8201)

const styles = StyleSheet.create({
    weatherContainerLong: {
        display: 'flex',
        flexDirection: 'row',
        width: 'auto',
        marginBottom: 24,
    },
    weatherContainerNarrow: {
        height: 'auto',
        flexDirection: 'column',
        paddingLeft: metrics.horizontal,
    },
    forecastItem: {
        borderStyle: 'solid',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    forecastItemLong: {
        height: 60,
        borderLeftWidth: 1,
        flex: 2,
        borderLeftColor: color.line,
        paddingTop: 2,
        paddingLeft: 4,
    },
    forecastItemNarrow: {
        paddingTop: metrics.vertical * 0.6,
        paddingBottom: metrics.vertical * 1.2,
        flexShrink: 0,
        flexGrow: 0,
        borderBottomColor: color.line,
        borderBottomWidth: 1,
    },
    temperature: {
        color: '#E05E00',
        ...getFont('sans', 0.5),
    },
    dateTime: {
        color: '#000000',
        ...getFont('sans', 0.5),
    },
    locationNameContainer: {
        flex: 1,
        height: 60,
        flexDirection: 'row',
    },
    locationName: {
        ...getFont('sans', 0.5),
        color: '#000000',
        lineHeight: 35,
    },
    locationPinIcon: {
        fontFamily: 'GuardianIcons-Regular',
        fontSize: 30,
        marginLeft: '-1%',
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

export interface WeatherForecast {
    locationName: string
    forecasts: Forecast[]
}

const WeatherIconView = ({
    forecast,
    style,
    iconSize = 1,
}: {
    forecast: Forecast
    style?: StyleProp<ViewStyle>
    iconSize?: number
}) => (
    <View style={[styles.forecastItem, style]}>
        <WeatherIcon
            iconNumber={forecast.WeatherIcon}
            fontSize={30 * iconSize}
        />
        <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="clip"
            style={styles.temperature}
        >
            {Math.round(forecast.Temperature.Value) +
                '°' +
                forecast.Temperature.Unit}
        </Text>
        <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="clip"
            style={styles.dateTime}
        >
            {Moment(forecast.DateTime).format(
                `h${narrowSpace /* Narrow space for iPhone 5 */}a`,
            )}
        </Text>
    </View>
)

const WeatherWithForecast = ({
    showSetLocationButton,
    onSetLocationPress,
    locationName,
    forecasts,
}: {
    showSetLocationButton: boolean
    onSetLocationPress: () => void
    locationName: string
    forecasts: Forecast[]
}) => {
    if (forecasts && forecasts.length >= 9) {
        /*Get the hourly forecast in 2 hour intervals from the 12 hour forecast.*/
        const intervals = [0, 2, 4, 6, 8].map(idx => forecasts[idx])
        return (
            <WithBreakpoints>
                {{
                    0: () => (
                        <View style={styles.weatherContainerLong}>
                            <GridRowSplit
                                proxy={
                                    <View
                                        style={{
                                            flex: 1,
                                            height: 60,
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <View
                                            style={styles.locationNameContainer}
                                        >
                                            <Text
                                                style={styles.locationPinIcon}
                                            >
                                                {'\uE01B'}
                                            </Text>
                                            <Text style={styles.locationName}>
                                                {locationName}
                                            </Text>
                                        </View>
                                        {showSetLocationButton && (
                                            <Button
                                                onPress={onSetLocationPress}
                                                appearance={
                                                    ButtonAppearance.skeleton
                                                }
                                            >
                                                Set Location
                                            </Button>
                                        )}
                                    </View>
                                }
                            >
                                {intervals.map(forecast => {
                                    return (
                                        <WeatherIconView
                                            style={styles.forecastItemLong}
                                            key={forecast.EpochDateTime}
                                            forecast={forecast}
                                        />
                                    )
                                })}
                            </GridRowSplit>
                        </View>
                    ),
                    [Breakpoints.tabletVertical]: () => (
                        <View style={styles.weatherContainerNarrow}>
                            {intervals.map(forecast => {
                                return (
                                    <WeatherIconView
                                        style={styles.forecastItemNarrow}
                                        key={forecast.EpochDateTime}
                                        forecast={forecast}
                                        iconSize={1.5}
                                    />
                                )
                            })}
                        </View>
                    ),
                }}
            </WithBreakpoints>
        )
    }

    return <Text>invalid weather</Text>
}

const GET_WEATHER_DATA = gql`
    query getWeatherData($locationPermissionStatus: String!) {
        weatherForecast(locationPermissionStatus: $locationPermissionStatus)
            @client
    }
`

export const Weather = React.memo(
    ({ locationPermissionStatus }: { locationPermissionStatus: string }) => {
        const weatherData = useQuery(GET_WEATHER_DATA, {
            variables: { locationPermissionStatus },
        })
        if (weatherData.error) console.error(weatherData.error)
        if (weatherData.loading || weatherData.data == null) return null
        const { weatherForecast } = weatherData.data
        return (
            <WeatherWithForecast
                locationName={weatherForecast.locationName}
                forecasts={weatherForecast.forecasts}
                showSetLocationButton={
                    locationPermissionStatus === RESULTS.DENIED
                }
                onSetLocationPress={() => {
                    requestLocationPermission(weatherData.client)
                }}
            />
        )
    },
)
