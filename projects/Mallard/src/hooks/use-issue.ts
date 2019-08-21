import { useCachedOrPromise } from './use-cached-or-promise'
import { fetchFromIssue } from 'src/helpers/fetch'
import { Issue, Front } from 'src/common'
import { withResponse } from 'src/helpers/response'
import { FSPaths, APIPaths } from 'src/paths'
import { PathToArticle } from 'src/screens/article-screen'
import {
    flattenCollectionsToCards,
    flattenFlatCardsToFront,
} from 'src/helpers/transform'
import { ERR_404_REMOTE } from 'src/helpers/words'
import { CachedOrPromise, chain } from 'src/helpers/fetch/cached-or-promise'
import { getLatestIssue } from './use-api'

export const useIssueWithResponse = <T>(
    getter: CachedOrPromise<T>,
    deps: any[] = [],
) => withResponse<T>(useCachedOrPromise<T>(getter, deps))

export const getIssueResponse = (issue: Issue['key']) => {
    return fetchFromIssue<Issue>(
        issue,
        FSPaths.issue(issue),
        APIPaths.issue(issue),
        {
            validator: res => {
                return res.fronts != null
            },
        },
    )
}

export const useIssueOrLatestResponse = (issue?: Issue['key']) => {
    return useIssueWithResponse(
        issue ? getIssueResponse(issue) : getLatestIssue(),
        [issue || 'latest'],
    )
}

export const getFrontsResponse = (issue: Issue['key'], front: Front['key']) => {
    return fetchFromIssue<Front>(
        issue,
        FSPaths.front(issue, front),
        APIPaths.front(issue, front),
        {
            validator: res => res.collections != null,
        },
    )
}
export const useFrontsResponse = (issue: Issue['key'], front: Front['key']) =>
    useIssueWithResponse(getFrontsResponse(issue, front), [issue, front])

export const getArticleResponse = ({ article, issue, front }: PathToArticle) =>
    chain(getFrontsResponse(issue, front), front => {
        const allArticles = flattenFlatCardsToFront(
            flattenCollectionsToCards(front.collections),
        )
        const articleContent = allArticles.find(
            ({ article: { key } }) => key === article,
        )

        if (articleContent) {
            return chain.end(articleContent)
        }
        throw ERR_404_REMOTE
    })

export const useArticleResponse = (path: PathToArticle) =>
    useIssueWithResponse(getArticleResponse(path), [
        path.article,
        path.collection,
        path.front,
        path.issue,
    ])
