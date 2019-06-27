import { useState, ReactElement, useEffect } from 'react'
import { REQUEST_INVALID_RESPONSE_STATE } from 'src/helpers/words'
import { ValueOrPromise, isPromise } from 'src/helpers/fetch/value-or-promise'

export interface Error {
    message: string
    name?: string
}
interface PendingResponse {
    state: 'pending'
}
interface ErroredResponse {
    state: 'error'
    error: Error
}
interface SuccesfulResponse<T> {
    state: 'success'
    response: T
}
export type Response<T> =
    | PendingResponse
    | ErroredResponse
    | SuccesfulResponse<T>

export const useResponse = <T>(
    initial: T | null,
): {
    response: Response<T>
    onSuccess: (res: T) => void
    onError: (error: Error) => void
} => {
    const [response, setResponse] = useState<
        SuccesfulResponse<T | null>['response']
    >(initial)
    const [error, setError] = useState<ErroredResponse['error']>({
        message: 'Mysterious error',
    })
    const [state, setState] = useState<Response<T>['state']>(
        initial ? 'success' : 'pending',
    )

    const onSuccess = (res: T) => {
        setResponse(res)
        setState('success')
    }
    const onError = (err: ErroredResponse['error']) => {
        setError(err)
        setState('error')
    }

    if (state === 'success' && response) {
        return {
            response: {
                state,
                response,
            },
            onSuccess,
            onError,
        }
    }
    if (state === 'error') {
        return {
            response: {
                state,
                error,
            },
            onSuccess,
            onError,
        }
    }
    return {
        response: {
            state: 'pending',
        },
        onSuccess,
        onError,
    }
}

export const withResponse = <T>(response: Response<T>) => ({
    success,
    pending,
    error,
}: {
    success: (resp: T) => ReactElement
    pending: () => ReactElement
    error: (error: Error) => ReactElement
}): ReactElement => {
    if (response.state === 'success') return success(response.response)
    else if (response.state === 'pending') return pending()
    else if (response.state === 'error') return error(response.error)
    else return error({ message: REQUEST_INVALID_RESPONSE_STATE })
}

export const usePromiseAsResponse = <T>(
    promise: ValueOrPromise<T>,
): Response<T> => {
    const { response, onSuccess, onError } = useResponse<T>(
        isPromise<T>(promise) ? null : promise.value,
    )
    useEffect(() => {
        if (isPromise(promise)) {
            promise
                .getValue()
                .then(data => {
                    onSuccess(data as T)
                })
                .catch((err: Error) => {
                    if (response.state !== 'success') {
                        onError(err)
                    }
                })
        }
    }, [])

    return response
}
