import { useContext } from 'react'
import { NavigationContext } from 'react-navigation'
import {
    ArticleNavigationProps,
    IssueNavigationProps,
} from 'src/navigation/helpers/base'
import { PathToIssue } from 'src/paths'

/**
 * This will try and look in the states of any navigator
 * and discern an issue id. I've tried to be as defensive
 * as possible here given these apis may change but given
 * different screens have their issue ids in different places
 * we can't do too much else, without a bigger refactor
 */

export const useIssueCompositeKey = (): PathToIssue | undefined => {
    const nav = useContext(NavigationContext)
    const path: ArticleNavigationProps['path'] | undefined = nav.getParam(
        'path',
    )
    if (path !== undefined) {
        const { localIssueId, publishedIssueId } = path
        if (!(localIssueId && publishedIssueId)) return undefined
        if (path) return { localIssueId, publishedIssueId }
    }
    const issue: IssueNavigationProps['issue'] | undefined = nav.getParam(
        'issue',
    )
    if (issue) {
        const { localId, publishedId } = issue
        return { localIssueId: localId, publishedIssueId: publishedId }
    }
    return undefined
}
