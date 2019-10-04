export type Connectivity = 'online' | 'offline'

type NotRun = { type: 'not-run-attempt' }

type ValidAttempt<T> = {
    type: 'valid-attempt'
    data: T
    connectivity: Connectivity
    time: number
}

type InvalidAttempt = {
    type: 'invalid-attempt'
    reason?: string
    connectivity: Connectivity
    time: number
}

export type ResolvedAttempt<T> = ValidAttempt<T> | InvalidAttempt

export type AnyAttempt<T> = NotRun | ResolvedAttempt<T>

const withConnectivity = <T>(
    connectivity: Connectivity,
    handlers: { [K in Connectivity]: () => T },
): T => {
    switch (connectivity) {
        case 'online': {
            return handlers.online()
        }
        case 'offline': {
            return handlers.offline()
        }
        default: {
            const x: never = connectivity
            return x
        }
    }
}

const NotRunRef: NotRun = {
    type: 'not-run-attempt',
}

const InvalidAttemptCons = (
    connectivity: Connectivity,
    reason?: string,
    time = Date.now(),
): InvalidAttempt => ({
    type: 'invalid-attempt',
    reason,
    connectivity,
    time,
})

const ValidAttemptCons = <T>(
    data: T,
    connectivity: Connectivity,
    time = Date.now(),
): ValidAttempt<T> => ({
    type: 'valid-attempt',
    connectivity,
    data,
    time,
})

const isNotRun = <T>(attempt: AnyAttempt<T>): attempt is NotRun =>
    attempt.type === 'not-run-attempt'

const hasRun = <T>(attempt: AnyAttempt<T>): attempt is ResolvedAttempt<T> =>
    !isNotRun(attempt)

const isValid = <T>(attempt: AnyAttempt<T>): attempt is ValidAttempt<T> =>
    attempt.type === 'valid-attempt'

const isOnline = <T>(attempt: ResolvedAttempt<T>) =>
    attempt.connectivity === 'online'

/**
 * As mentioned in the comments for the AccessController
 * this checks to see whether an attempt is less important than the previous attempt
 * (the access controller talks of "upgrading", this is the opposite)
 */
const isDowngrading = <T>(
    prev: ResolvedAttempt<T>,
    curr: ResolvedAttempt<T>,
) => {
    if (isOnline(prev)) {
        return !isOnline(curr) || (isValid(prev) && !isValid(curr))
    }
    return !isOnline(curr) && isValid(prev) && !isValid(curr)
}

const patchAttempt = <T, P extends AnyAttempt<T>, C extends AnyAttempt<T>>(
    prev: P,
    curr: C,
): C | null => {
    if (!hasRun(prev)) return curr
    if (!hasRun(curr)) return null
    return isDowngrading(prev, curr) ? null : curr
}

export {
    withConnectivity,
    NotRunRef as NotRun,
    ValidAttemptCons as ValidAttempt,
    InvalidAttemptCons as InvalidAttempt,
    isValid,
    isOnline,
    hasRun,
    isNotRun,
    patchAttempt,
}
