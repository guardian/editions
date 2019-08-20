export interface Failure {
    __failure: true
    httpStatus?: number
    error: Error | {}
    messages?: string[]
}

export const failure = (failure: Omit<Failure, '__failure'>): Failure => ({
    __failure: true,
    ...failure,
})

export const withFailureMessage = (
    failure: Failure,
    message: string,
): Failure => ({
    __failure: true,
    error: failure.error,
    httpStatus: failure.httpStatus,
    messages: [message, ...(failure.messages || [])],
})

export type Attempt<T extends Exclude<{}, string | Failure>> = Failure | T

/**
 *
 * @param attempt Attempt<T>
 * So Promise<?> would meet this, but then you won't get anything useful out.
 */
export const hasFailed = <T>(attempt: Attempt<T>): attempt is Failure =>
    typeof attempt === 'object' && '__failure' in attempt

/**
 *
 * @param attempt Attempt<T>
 * So Promise<?> would meet this, but then you won't get anything useful out.
 */
export const hasSucceeded = <T>(attempt: Attempt<T>): attempt is T =>
    !hasFailed(attempt)

export const attempt = <T>(promise: Promise<T>): Promise<Attempt<T>> =>
    new Promise(resolve => {
        promise
            .then(success => resolve(success))
            .catch(error => {
                resolve({ __failure: true, error })
            })
    })
