let cacheStore: {
    api: { [path: string]: any }
    local: { [path: string]: any }
} = {
    api: {},
    local: {},
}

export type CacheType = 'api' | 'local'

const storeInCache = <T>(cacheType: CacheType) => (path: string, data: T) => {
    cacheStore[cacheType][path] = data
}
const retrieveFromCache = <T>(cacheType: CacheType) => (
    path: string,
): T | undefined => cacheStore[cacheType][path]

const withCache = (cacheType: CacheType) => ({
    store: storeInCache(cacheType),
    retrieve: retrieveFromCache(cacheType),
})

const clearCache = () => {
    for (let url in cacheStore['api']) {
        delete cacheStore['api'][url]
        console.log(`deleted ${url}`)
    }
    for (let url in cacheStore['local']) {
        delete cacheStore['local'][url]
        console.log(`deleted ${url}`)
    }
}

export { withCache, clearCache }
