import { usePromiseAsResponse } from './use-response'
import { pickFromApi, ValidatorFn } from 'src/helpers/fetch'

export const useApiEndpoint = <T>(
    endpointPath: string,
    {
        validator = () => true,
    }: {
        validator?: ValidatorFn<T>
    } = {},
) => {
    return usePromiseAsResponse(pickFromApi(endpointPath, { validator }))
}
