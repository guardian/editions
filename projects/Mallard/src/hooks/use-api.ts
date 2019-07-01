import { useInstantPromise } from './use-instant-promise'
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
) => useInstantPromise(fetchFromApi(endpointPath, { validator, cached }))
