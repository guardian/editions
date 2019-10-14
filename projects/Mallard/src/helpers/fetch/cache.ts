const cacheStore: {
    api: { [path: string]: any }
    issue: { [path: string]: any }
    ipAddress: { [path: string]: string }
    weatherLocation: { [path: string]: any }
    weatherForecasts: { [path: string]: any }
    weatherForecastSummary: { [path: string]: any }
} = {
    api: {},
    issue: {},
    ipAddress: {},
    weatherLocation: {},
    weatherForecasts: {},
    weatherForecastSummary: {},
}

type CacheType =
    | 'api'
    | 'issue'
    | 'ipAddress'
    | 'weatherLocation'
    | 'weatherForecasts'
    | 'weatherForecastSummary'

const withCache = <T>(cacheType: CacheType) => ({
    store: (path: string, data: T) => {
        cacheStore[cacheType][path] = data
    },
    clear: (path: string) => {
        delete cacheStore[cacheType][path]
    },
    retrieve: (path: string): T | undefined => {
        return cacheStore[cacheType][path]
    },
})

const clearCache = () => {
    for (const url in cacheStore['api']) {
        delete cacheStore['api'][url]
        console.log(`deleted ${url}`)
    }
    for (const url in cacheStore['issue']) {
        delete cacheStore['issue'][url]
        console.log(`deleted ${url}`)
    }

    for (const url in cacheStore['ipAddress']) {
        delete cacheStore['ipAddress'][url]
        console.log(`deleted ${url}`)
    }

    for (const url in cacheStore['weatherLocation']) {
        delete cacheStore['weatherLocation'][url]
        console.log(`deleted ${url}`)
    }

    for (const url in cacheStore['weatherForecasts']) {
        delete cacheStore['weatherForecasts'][url]
        console.log(`deleted ${url}`)
    }

    for (const url in cacheStore['weatherForecastSummary']) {
        delete cacheStore['weatherForecastSummary'][url]
        console.log(`deleted ${url}`)
    }
}

export { withCache, clearCache }
