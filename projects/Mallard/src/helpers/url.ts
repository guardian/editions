const parseSearchString = (searchString: string) => {
    const paramArr = searchString.split('&')
    const init: { [key: string]: string } = {}
    return paramArr.reduce((acc, p) => {
        const [key, value] = p.split('=')
        return { ...acc, [key]: decodeURIComponent(value) }
    }, init)
}

const createSearchParams = (params: { [key: string]: string } = {}) =>
    Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')

export { createSearchParams, parseSearchString }
