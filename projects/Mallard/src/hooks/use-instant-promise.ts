import {
    InstantPromise,
    isSlowPromise,
} from 'src/helpers/fetch/instant-promise'
import {
    ResponseHookCallbacks,
    FetchableResponse,
    useFetchableResponse,
} from './use-response'

const promiseAsResponseEffect = <T>(
    promise: InstantPromise<T>,
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

const useInstantPromise = <T>(
    promise: InstantPromise<T>,
): FetchableResponse<T> => {
    const response = useFetchableResponse<T>(
        isSlowPromise<T>(promise) ? null : promise.value,
        (isInitial, { onSuccess, onError }) => {
            if (!isInitial || isSlowPromise(promise)) {
                promiseAsResponseEffect(promise, { onSuccess, onError })
            }
        },
    )

    return response
}

export { useInstantPromise }
