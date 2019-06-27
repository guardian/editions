import { usePromiseAsResponse } from './use-response'
import { fetchFromApi, ValidatorFn } from 'src/helpers/fetch'

export const useApiEndpoint = <T>(
    endpointPath: string,
    {
        validator,
        cached,
    }: {
        validator?: ValidatorFn<T>
        cached?: boolean
    } = {},
) => usePromiseAsResponse(fetchFromApi(endpointPath, { validator, cached }))
