import { Response, usePromiseAsResponse } from './use-response'
import { fetchFromIssue, ValidatorFn } from 'src/helpers/fetch'

export const useIssue = <T>(
    issueId: string,
    fsPath: string,
    endpointPath: string,
    { validator = () => true }: { validator?: ValidatorFn<T> } = {},
): Response<T> => {
    return usePromiseAsResponse(
        fetchFromIssue(issueId, fsPath, endpointPath, { validator }),
    )
}
