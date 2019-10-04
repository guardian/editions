import { useContext } from 'react'
import { NavigationContext } from 'react-navigation'
import {
    ArticleNavigationProps,
    IssueNavigationProps,
} from 'src/navigation/helpers/base'
import { PathToIssue } from 'src/paths'
import { getIssueSummary, getIssueSummaryNew } from './use-api'
import { useCachedOrPromise } from './use-cached-or-promise'

/**
 * This will try and look in the states of any navigator
 * and discern an issue id. Otherwise it will call for the
 * latest issue. I've tried to be as defensive
 * as possible here given these apis may change but given
 * different screens have their issue ids in different places
 * we can't do too much else, without a bigger refactor
 */

export const useIssueCompositeKeyHandler = () => {
    const nav = useContext(NavigationContext)
    const path: ArticleNavigationProps['path'] | undefined = nav.getParam(
        'path',
    )
    const issue: IssueNavigationProps['issue'] | undefined = nav.getParam(
        'issue',
    )

    // console.log('path', path)
    // console.log('issue', issue)

    // This will mean that any page that has come "from" an issue (that is not
    // itself an issue), will have this previous issue marked as it's current
    // issue, in order to facilitate actions to go back to or modals that
    // require that information
    const from: { path?: PathToIssue } | undefined = nav.getParam('from')

    // this is currently the easiest way to get to a value for the issue summar
    // could do with a refactor in to a service
    const response = useCachedOrPromise(getIssueSummary())

    let fromNav: PathToIssue | undefined = undefined

    if (path) {
        const { localIssueId, publishedIssueId } = path
        if (localIssueId && publishedIssueId)
            fromNav = { localIssueId, publishedIssueId }
    }

    if (issue) {
        const { localId, publishedId } = issue
        fromNav = fromNav || {
            localIssueId: localId,
            publishedIssueId: publishedId,
        }
    }

    if (from && from.path) {
        const { localIssueId, publishedIssueId } = from.path
        if (localIssueId && publishedIssueId)
            fromNav = fromNav || {
                localIssueId,
                publishedIssueId,
            }
    }

    return <R extends any>({
        error,
        pending,
        success,
    }: {
        error: (
            err: {
                message: string
                name?: string
            },
            stale: R | null,
            { retry }: { retry: () => void },
        ) => R
        pending: () => R
        success: (path: PathToIssue) => R
    }): R => {
        switch (response.state) {
            case 'pending': {
                console.log('pend')
                return fromNav ? success(fromNav) : pending()
            }
            case 'success': {
                const summary = response.response
                return fromNav
                    ? success(fromNav)
                    : success({
                          localIssueId: summary[0].localId,
                          publishedIssueId: summary[0].publishedId,
                      })
            }
            case 'error': {
                const { error: err, retry } = response
                return fromNav ? success(fromNav) : error(err, null, { retry })
            }
        }
    }
}

export const useIssueCompositeKey = () =>
    useIssueCompositeKeyHandler()({
        success: key => key,
        error: () => undefined,
        pending: () => undefined,
    })
