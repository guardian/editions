import { useCachedOrPromise } from './use-cached-or-promise'
import { FetchableResponse } from './use-response'
import { fetchFromIssue, ValidatorFn } from 'src/helpers/fetch'

export const useIssue = <T>(
    issueId: string,
    fsPath: string,
    endpointPath: string,
    { validator }: { validator?: ValidatorFn<T> } = {},
): FetchableResponse<T> =>
    useCachedOrPromise(
        fetchFromIssue(issueId, fsPath, endpointPath, { validator }),
    )
