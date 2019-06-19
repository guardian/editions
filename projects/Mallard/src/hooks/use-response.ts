import { useState, ReactElement } from 'react'
import { REQUEST_INVALID_RESPONSE_STATE } from 'src/helpers/words'

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
    initial: T,
): {
    response: Response<T>
    onSuccess: (res: T) => void
    onError: (error: Error) => void
} => {
    const [response, setResponse] = useState<SuccesfulResponse<T>['response']>(
        initial,
    )
    const [error, setError] = useState<ErroredResponse['error']>({
        message: 'Mysterious error',
    })
    const [state, setState] = useState<Response<T>['state']>(
        initial ? 'success' : 'pending',
    )
    return {
        response:
            state === 'success'
                ? {
                      state,
                      response,
                  }
                : state === 'error'
                ? { state, error }
                : { state },

        onSuccess: res => {
            setResponse(res)
            setState('success')
        },
        onError: err => {
            setError(err)
            setState('error')
        },
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
