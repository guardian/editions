/**
 * We want to handle 500s in resilient ways so we need to know
 * if service errors are 500s and maybe try and read cached data
 */

export class Error5XX extends Error {
    constructor() {
        super(__DEV__ ? 'Internal server error' : 'Something went wrong')
    }
}

export const handle5XX = <T>(cont: (e: Error5XX) => T) => (e: any) => {
    if (e instanceof Error5XX) {
        return cont(e)
    }
    throw e
}
