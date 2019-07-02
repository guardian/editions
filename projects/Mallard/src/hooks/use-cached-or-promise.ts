import {
    CachedOrPromise,
    isNotCached,
} from 'src/helpers/fetch/cached-or-promise'
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
): FetchableResponse<T> => {
    const response = useFetchableResponse<T>(
        isNotCached<T>(promise) ? null : promise.value,
        (isInitial, { onSuccess, onError }) => {
            if (!isInitial || isNotCached(promise)) {
                promiseAsResponseEffect(promise, { onSuccess, onError })
            }
        },
    )

    return response
}

export { useCachedOrPromise }
