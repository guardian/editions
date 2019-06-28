import { Request, Response as ExpressResponse } from 'express'
import fetch, { Response } from 'node-fetch'

const accuWeatherBaseUrl: string = 'https://weather.guardianapis.com'

const accuWeatherApiKey: string | undefined = process.env.ACCUWEATHER_API_KEY || undefined

const getLocationKey = (ipAddress: string): Promise<Response> => {
    return fetch(`${accuWeatherBaseUrl}/locations/v1/cities/ipaddress?apikey=${accuWeatherApiKey}&details=true&metric=true&language=en-gb&q=${ipAddress}`)
}

const getWeatherForecastForLocation = (locationKey: string): Promise<Response> => {
    return fetch(`${accuWeatherBaseUrl}/forecasts/v1/hourly/12hour/${locationKey}.json?apikey=3e74092c580e46319d36f04e68734365&details=true&metric=true&language=en-gb`)
}

export const weatherController = (req: Request, res: ExpressResponse) => {
    const ipAddress: string = req.params.ipAddress

    getLocationKey(ipAddress)
        .then(async resp => {

            if (resp.status != 200) {
                res.status(resp.status)
                res.send("Cannot get location key")
                return
            }

            const json = await resp.json()
            
            const locationKey: string = json.Key

            if (!locationKey) {
                res.status(500).send("Error: could not get location key for the given IP address.")  
                return
            }  
            
            return getWeatherForecastForLocation(locationKey).then(async resp => {

                if (resp.status != 200) {
                    res.status(resp.status)
                    res.send("Cannot get location key")
                    return
                }

                const json = await resp.json()

                res.setHeader('Content-Type', 'application/json')
                res.send(JSON.stringify(json))
            })
        })
        .catch(e => console.error(e))
}