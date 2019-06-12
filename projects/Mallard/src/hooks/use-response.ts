import { useState, ReactElement } from 'react'

export interface Error {
    message: string
    name?: string
}
interface PendingResponse {
    type: 'pending'
}
interface ErroredResponse {
    type: 'error'
    error: Error
}
interface SuccesfulResponse<T> {
    type: 'success'
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
    const [response, setResponse] = useState<T>(initial)
    const [error, setError] = useState({ message: 'Mysterious error' })
    const [type, setType] = useState<Response<T>['type']>(
        initial ? 'success' : 'pending',
    )
    return {
        response:
            type === 'success'
                ? {
                      type,
                      response,
                  }
                : type === 'error'
                ? { type, error }
                : { type },

        onSuccess: res => {
            setResponse(res)
            setType('success')
        },
        onError: err => {
            setError(err)
            setType('error')
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
    if (response.type === 'success') return success(response.response)
    else if (response.type === 'pending') return pending()
    else if (response.type === 'error') return error(response.error)
    else return error({ message: 'Request failed' })
}
