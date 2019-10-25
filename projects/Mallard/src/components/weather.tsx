import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Forecast } from '../common'
import { metrics } from 'src/theme/spacing'
import { WeatherIcon } from './weather/weatherIcon'
import Moment from 'moment'
import { color } from 'src/theme/color'
import { getFont } from 'src/theme/typography'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Button, ButtonAppearance } from './button/button'
import { RESULTS } from 'react-native-permissions'
import { withNavigation, NavigationInjectedProps } from 'react-navigation'
import { routeNames } from 'src/navigation/routes'
import { WithBreakpoints } from './layout/ui/sizing/with-breakpoints'
import { Breakpoints } from 'src/theme/breakpoints'

const narrowSpace = String.fromCharCode(8201)

const styles = StyleSheet.create({
    weatherContainer: {
        display: 'flex',
        flexDirection: 'row-reverse',
        marginBottom: 24,
    },
    forecastItem: {
        borderStyle: 'solid',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        borderLeftWidth: 1,
        borderLeftColor: color.line,
    },
    forecastItemNarrow: {
        height: 64,
        paddingTop: 2,
        paddingLeft: 4,
        paddingRight: 8,
    },
    forecastItemWide: {
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: metrics.horizontal * 0.5,
        paddingRight: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
    forecastText: {
        display: 'flex',
        flexDirection: 'column',
    },
    forecastTextWide: {
        marginLeft: metrics.horizontal * 0.5,
    },
    temperature: {
        color: '#E05E00',
        ...getFont('sans', 0.5),
        marginTop: 4,
    },
    dateTime: {
        color: '#000000',
        ...getFont('sans', 0.5),
    },
    locationNameContainer: {
        flexDirection: 'row',
        marginTop: metrics.vertical * 0.5,
        marginRight: metrics.horizontal,
    },
    locationName: {
        ...getFont('sans', 0.5),
        color: '#000000',
        marginTop: 15,
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
    setLocationButtonWrap: {
        marginTop: metrics.vertical,
    },
    /**
     * Exceptionnally, make the button smaller so as to fit in the limited
     * space on smaller devices.
     */
    setLocationButton: {
        paddingHorizontal: metrics.horizontal * 0.75,
        height: metrics.buttonHeight * 0.75,
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
    iconSize = 1,
}: {
    forecast: Forecast
    iconSize?: number
}) => {
    const info = (
        <>
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
        </>
    )
    const icon = (
        <WeatherIcon
            iconNumber={forecast.WeatherIcon}
            fontSize={30 * iconSize}
        />
    )

    return (
        <WithBreakpoints>
            {{
                0: () => (
                    <View
                        style={[styles.forecastItem, styles.forecastItemNarrow]}
                    >
                        {icon}
                        <View style={styles.forecastText}>{info}</View>
                    </View>
                ),
                [Breakpoints.tabletVertical]: () => (
                    <View
                        style={[styles.forecastItem, styles.forecastItemWide]}
                    >
                        {icon}
                        <View
                            style={[
                                styles.forecastText,
                                styles.forecastTextWide,
                            ]}
                        >
                            {info}
                        </View>
                    </View>
                ),
            }}
        </WithBreakpoints>
    )
}

const Forecasts = ({
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
        const intervals = [0, 2, 4, 6, 8].map(idx => forecasts[idx]).reverse()
        return (
            <View style={styles.weatherContainer}>
                {intervals.map(forecast => {
                    return (
                        <WeatherIconView
                            key={forecast.EpochDateTime}
                            forecast={forecast}
                        />
                    )
                })}
                <View style={styles.locationNameContainer}>
                    {showSetLocationButton ? (
                        <Button
                            onPress={onSetLocationPress}
                            appearance={ButtonAppearance.skeleton}
                            style={styles.setLocationButtonWrap}
                            buttonStyles={styles.setLocationButton}
                        >
                            Set Location
                        </Button>
                    ) : (
                        <>
                            <Text style={styles.locationPinIcon}>
                                {'\uE01B'}
                            </Text>
                            <Text style={styles.locationName}>
                                {locationName}
                            </Text>
                        </>
                    )}
                </View>
            </View>
        )
    }

    // FIXME: We really should validate data after fetching, not during
    // rendering. That way the error would get handled further up the chain
    // instead of rendering a blank space with no logging.
    return <></>
}

const GET_WEATHER_DATA = gql`
    query getWeatherData($locationPermissionStatus: String!) {
        weatherForecast(locationPermissionStatus: $locationPermissionStatus)
            @client
    }
`

type Props = { locationPermissionStatus: string } & NavigationInjectedProps

const MS_IN_A_SECOND = 1000
const SECS_IN_A_MINUTE = 60
const MINS_IN_AN_HOUR = 60
const THREE_HOURS = MS_IN_A_SECOND * SECS_IN_A_MINUTE * MINS_IN_AN_HOUR * 3

/**
 * We do a local query instead of doing it higher up in the tree so that we
 * try fetch forecasts only if the weather widget is indeed shown. We also have
 * poll interval to refresh weather every so often.
 *
 * (Also, we have a dependency over the `locationPermissionStatus`.
 * Theoretically Apollo would allows us to use the `@export` directive,
 * but it's got bugs; in v2.6 at time of writing this).
 */
export const Weather = withNavigation(
    React.memo(({ locationPermissionStatus, navigation }: Props) => {
        const { error, loading, data } = useQuery(GET_WEATHER_DATA, {
            variables: { locationPermissionStatus },
            pollInterval: THREE_HOURS,
        })
        if (error) throw error
        if (loading) return null
        const { weatherForecast } = data
        return (
            <Forecasts
                locationName={weatherForecast.locationName}
                forecasts={weatherForecast.forecasts}
                showSetLocationButton={
                    locationPermissionStatus === RESULTS.DENIED
                }
                onSetLocationPress={() => {
                    navigation.navigate(routeNames.WeatherGeolocationConsent)
                }}
            />
        )
    }),
)
