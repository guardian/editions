/**
 * We want to handle 500s in resilient ways so we need to know
 * if service errors are 500s and maybe try and read cached data
 */

export class Error5XX extends Error {
    constructor() {
        super(__DEV__ ? 'Internal server error' : 'Something went wrong')
    }
}

export class Error401 extends Error {
    constructor() {
        super(__DEV__ ? 'Unauthorized' : 'Something went wrong')
    }
}

export class Timeout extends Error {
    constructor() {
        super(__DEV__ ? 'Timeout' : 'Something went wrong')
    }
}

export const withTimeout = <T>(promise: Promise<T>, timeout: number) =>
    Promise.race([
        promise,
        new Promise((_, rej) =>
            setTimeout(() => {
                rej(new Timeout())
            }, timeout),
        ),
    ]) as Promise<T>

export const handleFetchError = <T>({
    error,
    unauthorized,
}: {
    error?: (e: Error5XX) => T
    unauthorized?: (e: Error5XX) => T
}) => (e: any) => {
    if (error && (e instanceof Error5XX || e instanceof Timeout)) {
        return error(e)
    }
    if (unauthorized && e instanceof Error401) {
        return unauthorized(e)
    }
    throw e
}
