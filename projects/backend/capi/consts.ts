//copy of thift enum because it won't import
export enum Platform {
    YOUTUBE = 0,
    FACEBOOK = 1,
    DAILYMOTION = 2,
    MAINSTREAM = 3,
    URL = 4,
}
export const getPlatformName = (
    p: Platform | undefined,
): 'youtube' | 'dailymotion' | 'mainstream' | 'url' | undefined => {
    switch (p) {
        case Platform.YOUTUBE:
            return 'youtube'
        case Platform.DAILYMOTION:
            return 'dailymotion'
        case Platform.MAINSTREAM:
            return 'mainstream'
        case Platform.URL:
            return 'url'
    }
    return undefined
}
