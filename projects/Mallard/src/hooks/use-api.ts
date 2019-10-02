import { IssueSummary, issueSummaryPath } from 'src/common'
import { fetchFromApi } from 'src/helpers/fetch'
import { withResponse } from 'src/helpers/response'
import { useCachedOrPromise } from './use-cached-or-promise'
import { defaultSettings } from 'src/helpers/settings/defaults'

export const getIssueSummary = () =>
    fetchFromApi<IssueSummary[]>(
        issueSummaryPath(defaultSettings.contentPrefix),
        {
            cached: false,
            validator: res => res.length > 0,
        },
    )

export const useIssueSummary = () => {
    const response = useCachedOrPromise(getIssueSummary())
    return {
        response: withResponse<IssueSummary[]>(response),
        retry: response.retry,
    }
}
