const parseSearchString = (searchString: string) => {
    const paramString = searchString.split('&')
    const init: { [key: string]: string } = {}
    return paramString.reduce((acc, p) => {
        const [key, value] = p.split('=')
        return { ...acc, [key]: decodeURIComponent(value) }
    }, init)
}

const createSearchParams = (params: { [key: string]: string } = {}) =>
    Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')

export { createSearchParams, parseSearchString }
