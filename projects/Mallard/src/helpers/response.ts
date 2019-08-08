import { ReactElement } from 'react'
import { FetchableResponse, Error } from 'src/hooks/use-response'

interface WithResponseCallbacks {
    retry: () => void
}

export interface WithResponseArgs<T> {
    success: (resp: T, callbacks: WithResponseCallbacks) => ReactElement
    pending: (stale: T | null, callbacks: WithResponseCallbacks) => ReactElement
    error: (
        error: Error,
        stale: T | null,
        callbacks: WithResponseCallbacks,
    ) => ReactElement
}

export type WithResponse<T> = (_: WithResponseArgs<T>) => ReactElement

export const withResponse = <T>(response: FetchableResponse<T>) => ({
    success,
    pending,
    error,
}: WithResponseArgs<T>): ReactElement => {
    switch (response.state) {
        case 'success':
            return success(response.response, { retry: response.retry })
        case 'error':
            return error(response.error, response.staleResponse, {
                retry: response.retry,
            })
        case 'pending':
            return pending(response.staleResponse, { retry: response.retry })
    }
}
