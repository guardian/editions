let cacheStore: {
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
        // console.log("STORING IN CACHE: ", cacheType, path, data)
        cacheStore[cacheType][path] = data
    },
    clear: (path: string) => {
        delete cacheStore[cacheType][path]
    },
    retrieve: (path: string): T | undefined => {
        // console.log("GETTING FROM CACHE", cacheStore[cacheType][path])
        return cacheStore[cacheType][path]
    }
})

const clearCache = () => {
    for (let url in cacheStore['api']) {
        delete cacheStore['api'][url]
        console.log(`deleted ${url}`)
    }
    for (let url in cacheStore['issue']) {
        delete cacheStore['issue'][url]
        console.log(`deleted ${url}`)
    }

    for (let url in cacheStore['weather']) {
        delete cacheStore['weather'][url]
        console.log(`deleted ${url}`)
    }
}

export { withCache, clearCache }
