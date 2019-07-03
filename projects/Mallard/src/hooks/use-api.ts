import { useCachedOrPromise } from './use-cached-or-promise'
import { fetchFromApi, ValidatorFn } from 'src/helpers/fetch'
import { issueSummaryPath, IssueSummary } from 'src/common'
import { withResponse } from 'src/helpers/response'

export const getIssueSummary = () =>
    fetchFromApi<IssueSummary[]>(issueSummaryPath(), { cached: true })

export const useIssueSummary = () =>
    withResponse<IssueSummary[]>(useCachedOrPromise(getIssueSummary()))
