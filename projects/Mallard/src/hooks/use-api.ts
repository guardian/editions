import { IssueSummary, issueSummaryPath } from 'src/common'
import { fetchFromApi } from 'src/helpers/fetch'
import { withResponse } from 'src/helpers/response'
import { useCachedOrPromise } from './use-cached-or-promise'
import { defaultSettings } from 'src/helpers/settings/defaults'
import { useNetInfo } from 'src/hooks/use-net-info'
import { storeIssueSummary, readIssueSummary } from '../helpers/files'

export const getIssueSummaryNew = () => {
    const { isConnected } = useNetInfo()

    return {
        type: 'promise',
        getValue: isConnected ? storeIssueSummary : readIssueSummary,
    }
}

export const getIssueSummary = () =>
    fetchFromApi<IssueSummary[]>(
        issueSummaryPath(defaultSettings.contentPrefix),
        {
            cached: false,
            validator: res => res.length > 0,
        },
    )

export const useIssueSummary = () => {
    const response = useCachedOrPromise(getIssueSummaryNew())
    return {
        response: withResponse<IssueSummary[]>(response),
        retry: response.retry,
    }
}
