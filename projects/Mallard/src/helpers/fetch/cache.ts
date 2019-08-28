const cacheStore: {
    api: { [path: string]: any }
    issue: { [path: string]: any }
    weather: { [path: string]: any }
} = {
    api: {},
    issue: {},
    weather: {},
}

type CacheType = 'api' | 'issue' | 'weather'

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

    for (const url in cacheStore['weather']) {
        delete cacheStore['weather'][url]
        console.log(`deleted ${url}`)
    }
}

export { withCache, clearCache }
