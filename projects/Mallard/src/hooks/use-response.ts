import { ReactElement, useEffect, useState } from 'react'
import {
    InstantPromise,
    isSlowPromise,
} from 'src/helpers/fetch/instant-promise'

export interface Error {
    message: string
    name?: string
}

type PureResponse<T> =
    | {
          state: 'pending'
      }
    | {
          state: 'error'
          error: Error
      }
    | {
          state: 'success'
          response: T
      }

export type Response<T> = PureResponse<T> & {
    retry: () => void
}

export interface ResponseHookCallbacks<T> {
    onSuccess: (res: T) => void
    onError: (error: Error) => void
}

export const useResponse = <T>(
    initial: T | null,
    { onRequestRetry }: { onRequestRetry: () => void },
): [Response<T>, ResponseHookCallbacks<T>] => {
    const [response, setResponse] = useState<PureResponse<T>>(
        initial
            ? {
                  state: 'success',
                  response: initial,
              }
            : {
                  state: 'pending',
              },
    )

    const onSuccess = (response: T) => {
        setResponse({ state: 'success', response })
    }
    const onError = (error: Error) => {
        setResponse({ state: 'error', error })
    }
    const retry = () => {
        setResponse({ state: 'pending' })
        onRequestRetry()
    }

    return [
        {
            ...response,
            retry,
        },
        {
            onSuccess,
            onError,
        },
    ]
}

interface WithResponseCallbacks {
    retry: () => void
}

export const withResponse = <T>(response: Response<T>) => ({
    success,
    pending,
    error,
}: {
    success: (resp: T, callbacks: WithResponseCallbacks) => ReactElement
    pending: (callbacks: WithResponseCallbacks) => ReactElement
    error: (error: Error, callbacks: WithResponseCallbacks) => ReactElement
}): ReactElement => {
    switch (response.state) {
        case 'success':
            return success(response.response, { retry: response.retry })
        case 'error':
            return error(response.error, { retry: response.retry })
        case 'pending':
            return pending({ retry: response.retry })
    }
}

const promiseAsResponseEffect = <T>(
    promise: InstantPromise<T>,
    { onSuccess, onError }: ResponseHookCallbacks<T>,
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

export const usePromiseAsResponse = <T>(
    promise: InstantPromise<T>,
): Response<T> => {
    const [response, callbacks] = useResponse<T>(
        isSlowPromise<T>(promise) ? null : promise.value,
        {
            onRequestRetry: () => promiseAsResponseEffect(promise, callbacks),
        },
    )
    useEffect(() => {
        if (isSlowPromise(promise)) {
            promiseAsResponseEffect(promise, callbacks)
        }
    }, [])

    return response
}
