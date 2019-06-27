let cacheStore: {
    api: { [path: string]: any }
    issue: { [path: string]: any }
} = {
    api: {},
    issue: {},
}

type CacheType = 'api' | 'issue'

const withCache = <T>(cacheType: CacheType) => ({
    store: (path: string, data: T) => {
        cacheStore[cacheType][path] = data
    },
    clear: (path: string) => {
        delete cacheStore[cacheType][path]
    },
    retrieve: (path: string): T | undefined => cacheStore[cacheType][path],
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
}

export { withCache, clearCache }
