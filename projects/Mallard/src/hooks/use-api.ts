import { useCachedOrPromise } from './use-cached-or-promise'
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
) => useCachedOrPromise<T>(fetchFromApi(endpointPath, { validator, cached }))
