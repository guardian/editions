import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Forecast } from '../common'
import { metrics } from 'src/theme/spacing'
import { WeatherIcon } from './weather/weatherIcon'
import Moment from 'moment'
import { color } from 'src/theme/color'
import { getFont } from 'src/theme/typography'
import { WithBreakpoints } from './layout/ui/sizing/with-breakpoints'
import { Breakpoints } from 'src/theme/breakpoints'
import { useQuery } from 'src/hooks/apollo'
import gql from 'graphql-tag'

type QueryForecast = Pick<
    Forecast,
    'DateTime' | 'Temperature' | 'WeatherIcon' | 'EpochDateTime'
>
type QueryData = {
    weather:
        | {
              locationName: string
              forecasts: QueryForecast[]
              available: true
          }
        | {
              available: false
          }
}

const QUERY = gql`
    {
        weather @client {
            locationName
            forecasts {
                DateTime
                Temperature {
                    Value
                    Unit
                }
                WeatherIcon
                EpochDateTime
            }
            available
        }
    }
`

const narrowSpace = String.fromCharCode(8201)

const styles = StyleSheet.create({
    weatherContainer: {
        display: 'flex',
        flexDirection: 'row-reverse',
        width: 'auto',
        marginBottom: 24,
    },
    forecastItem: {
        borderStyle: 'solid',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderLeftWidth: 1,
        borderLeftColor: color.line,
    },
    forecastItemNarrow: {
        height: 64,
        width: 45,
        paddingTop: 2,
        paddingLeft: 4,
        paddingRight: 8,
    },
    forecastItemWide: {
        width: 90,
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
        marginTop: 4,
        ...getFont('sans', 0.5),
    },
    dateTime: {
        color: '#000000',
        ...getFont('sans', 0.5),
    },
    locationNameContainer: {
        flexDirection: 'row',
        marginTop: metrics.vertical * 0.5,
        marginRight: metrics.horizontal,
        flexShrink: 1,
    },
    locationName: {
        ...getFont('sans', 0.5),
        color: '#000000',
        marginTop: 15,
        flexShrink: 1,
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

export interface WeatherForecast {
    locationName: string
    forecasts: QueryForecast[]
}

const WeatherIconView = ({
    forecast,
    iconSize = 1,
}: {
    forecast: QueryForecast
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

const WeatherWithForecast = ({
    locationName,
    forecasts,
}: {
    locationName: string
    forecasts: QueryForecast[]
}) => {
    if (forecasts && forecasts.length >= 9) {
        /*Get the hourly forecast in 2 hour intervals from the 12 hour forecast.*/
        const intervals = [8, 6, 4, 2, 0].map(idx => forecasts[idx])
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
                    <Text style={styles.locationPinIcon}>{'\uE01B'}</Text>
                    <Text style={styles.locationName} numberOfLines={2}>
                        {locationName}
                    </Text>
                </View>
            </View>
        )
    }

    // FIXME: We really should validate data after fetching, not during
    // rendering. That way the error would get handled further up the chain
    // instead of rendering a blank space with no logging.
    return <></>
}

const WeatherWidget = React.memo(() => {
    const query = useQuery<QueryData>(QUERY)
    if (query.loading) return null

    const { data } = query
    if (!data.weather.available) return null
    return (
        <WeatherWithForecast
            locationName={data.weather.locationName}
            forecasts={data.weather.forecasts}
        />
    )
})

export { WeatherWidget }
