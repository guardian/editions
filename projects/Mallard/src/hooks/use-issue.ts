import { useEndpointResponse } from './use-fetch'
import { Issue } from '../common'
export const useIssue = <T>(issue: string) =>
    useEndpointResponse<Issue, T>(
        `edition/${issue}`,
        issue =>
            issue &&
            issue.name &&
            typeof issue.name === 'string' &&
            issue.fronts &&
            Array.isArray(issue.fronts),
    )
