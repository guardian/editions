import { withCache } from './fetch/cache'
import { getSetting } from './settings'
import {
    CachedOrPromise,
    createCachedOrPromise,
} from './fetch/cached-or-promise'
import { getJson, isIssueOnDevice, deleteIssueFiles } from './files'
import { Issue } from 'src/common'
import { defaultSettings } from './settings/defaults'
import { cacheClearCache } from './storage'
import { FSPaths, APIPaths } from 'src/paths'
import { Front, IssueWithFronts } from '../../../Apps/common/src'

export type ValidatorFn<T> = (response: any | T) => boolean

const fetchIssueWithFrontsFromAPI = async (
    id: string,
): Promise<IssueWithFronts> => {
    const apiUrl = await getSetting('apiUrl')
    const issue: Issue = await fetch(`${apiUrl}${APIPaths.issue(id)}`).then(
        res => {
            if (res.status !== 200) {
                throw new Error('Failed to fetch')
            }
            return res.json()
        },
    )
    const fronts: Front[] = await Promise.all(
        issue.fronts.map(frontId =>
            fetch(`${apiUrl}${APIPaths.front(id, frontId)}`).then(res => {
                if (res.status !== 200) {
                    throw new Error('Failed to fetch')
                }
                return res.json()
            }),
        ),
    )
    return {
        ...issue,
        origin: 'api',
        fronts,
    }
}

const fetchIssueWithFrontsFromFS = async (
    id: string,
): Promise<IssueWithFronts> => {
    const issue = await getJson<Issue>(FSPaths.issue(id))
    const fronts = await Promise.all(
        issue.fronts.map(frontId => getJson<Front>(FSPaths.front(id, frontId))),
    )
    return {
        ...issue,
        origin: 'filesystem',
        fronts,
    }
}

const fetchIssue = (
    localIssueId: Issue['localId'],
    publishedIssueId: Issue['publishedId'],
): CachedOrPromise<IssueWithFronts> => {
    /*
    retrieve any cached value if we have any
    TODO: invalidate/background refresh these values
    */
    const { retrieve, store } = withCache<IssueWithFronts>('issue')
    return createCachedOrPromise(
        [
            retrieve(localIssueId),
            async () => {
                const issueOnDevice = await isIssueOnDevice(localIssueId)
                if (issueOnDevice) {
                    return fetchIssueWithFrontsFromFS(localIssueId)
                } else {
                    return fetchIssueWithFrontsFromAPI(publishedIssueId)
                }
            },
        ],
        {
            savePromiseResultToValue: result => {
                store(localIssueId, result)
            },
        },
    )
}

const fetchDeprecationWarning = async (): Promise<{
    android: string
    ios: string
}> => {
    const response = await fetch(defaultSettings.deprecationWarningUrl)
    return response.json()
}

const getCacheNumber = async (): Promise<{ cacheClear: string }> => {
    const response = await fetch(defaultSettings.cacheClearUrl)
    return response.json()
}

const fetchCacheClear = async (): Promise<boolean> => {
    try {
        const [cacheNumber, cacheNumberStorage] = await Promise.all([
            getCacheNumber(),
            cacheClearCache.get(),
        ])

        if (cacheNumberStorage === null) {
            // No data, so store it
            await cacheClearCache.set(cacheNumber.cacheClear)
            // Suggests that this is a new user, so carry on as normal
            return true
        }

        if (cacheNumberStorage !== cacheNumber.cacheClear) {
            // Deletes downloaded issues and the cache clear - login and GDPR settings need to be kept
            await deleteIssueFiles()
            await cacheClearCache.reset()
            // Server number doesnt match, which means we are making an attempt to clear the cache.
            return false
        }

        // Cached number matches Remote number, so carry on as normal
        return true
    } catch (e) {
        // Problems? Lets carry on with what we are doing.
        return true
    }
}

export { fetchIssue, fetchCacheClear, fetchDeprecationWarning }
