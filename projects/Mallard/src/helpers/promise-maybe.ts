interface PendingPromise<T> {
    state: 'unresolved'
    getValue: () => Promise<T>
}

interface ResolvedPromise<T> {
    state: 'resolved'
    value: T
}

export type PromiseMaybe<T> = ResolvedPromise<T> | PendingPromise<T>

const isPromise = <T>(promise: PromiseMaybe<T>): promise is PendingPromise<T> =>
    promise.state === 'unresolved'

const returnResolved = <T>(value: T): ResolvedPromise<T> => ({
    state: 'resolved',
    value,
})

const returnPromise = <T>(getValue: () => Promise<T>): PendingPromise<T> => ({
    state: 'unresolved',
    getValue,
})

export { returnResolved, returnPromise, isPromise }
