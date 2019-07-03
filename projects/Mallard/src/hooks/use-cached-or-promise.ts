import { CachedOrPromise, isCached } from 'src/helpers/fetch/cached-or-promise'
import {
    ResponseHookCallbacks,
    FetchableResponse,
    useFetchableResponse,
} from './use-response'

const promiseAsResponseEffect = <T>(
    promise: CachedOrPromise<T>,
    {
        onSuccess,
        onError,
    }: Pick<ResponseHookCallbacks<T>, 'onSuccess' | 'onError'>,
) => {
    promise
        .getValue()
        .then(data => {
            onSuccess(data)
        })
        .catch((err: Error) => {
            /*
            TODO: response should handle
            the error + stale data case
            */
            onError(err)
        })
}

const useCachedOrPromise = <T>(
    promise: CachedOrPromise<T>,
    effectDependencies: unknown[] = [],
): FetchableResponse<T> => {
    const response = useFetchableResponse<T>(
        !isCached<T>(promise) ? null : promise.value,
        (isInitial, { onSuccess, onError }) => {
            if (!isInitial || !isCached(promise)) {
                promiseAsResponseEffect(promise, { onSuccess, onError })
            }
        },
        effectDependencies,
    )

    return response
}

export { useCachedOrPromise }
