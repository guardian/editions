import { usePromiseAsResponse } from './use-response'
import { fetchFromApi, ValidatorFn } from 'src/helpers/fetch'

export const useApiEndpoint = <T>(
    endpointPath: string,
    {
        validator = () => true,
    }: {
        validator?: ValidatorFn<T>
    } = {},
) => {
    return usePromiseAsResponse(fetchFromApi(endpointPath, { validator }))
}
