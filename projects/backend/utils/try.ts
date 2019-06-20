export interface Failure {
    __failure: true
    error: Error | {}
}

export type Attempt<T> = Failure | T

/**
 *
 * @param attempt Attempt<T>
 * So Promise<?> would meet this, but then you won't get anything useful out.
 */
export const hasFailed = <T>(attempt: Attempt<T>): attempt is Failure =>
    '__failure' in attempt

/**
 *
 * @param attempt Attempt<T>
 * So Promise<?> would meet this, but then you won't get anything useful out.
 */
export const hasSucceeded = <T>(attempt: Attempt<T>): attempt is T =>
    !('__failure' in attempt)

export const attempt = <T>(promise: Promise<T>): Promise<Attempt<T>> =>
    new Promise(resolve => {
        promise
            .then(success => resolve(success))
            .catch(error => resolve({ __failure: true, error }))
    })
