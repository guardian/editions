import { ReactElement } from 'react'
import {
    FetchableResponse,
    Error,
    ResponseHookCallbacks,
} from 'src/hooks/use-response'
import { CachedOrPromise } from './fetch/cached-or-promise'

interface WithResponseCallbacks<T> {
    retry: () => void
}

export const withResponse = <T>(response: FetchableResponse<T>) => ({
    success,
    pending,
    error,
}: {
    success: (resp: T, callbacks: WithResponseCallbacks<T>) => ReactElement
    pending: (callbacks: WithResponseCallbacks<T>) => ReactElement
    error: (error: Error, callbacks: WithResponseCallbacks<T>) => ReactElement
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
