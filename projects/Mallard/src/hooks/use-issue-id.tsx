import { useContext } from 'react'
import { NavigationContext } from 'react-navigation'
import {
    ArticleNavigationProps,
    IssueNavigationProps,
} from 'src/navigation/helpers/base'

/**
 * This will try and look in the states of any navigator
 * and discern an issue id. I've tried to be as defensive
 * as possible here given these apis may change but given
 * different screens have their issue ids in different places
 * we can't do too much else, without a bigger refactor
 */

const useIssueId = () => {
    const nav = useContext(NavigationContext)
    const path: ArticleNavigationProps['path'] | undefined = nav.getParam(
        'path',
    )
    if (path) return path.issue || null
    const issue: IssueNavigationProps['issue'] | undefined = nav.getParam(
        'issue',
    )
    if (issue) return issue.key || null
    return null
}

export { useIssueId }
