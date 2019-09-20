import { Front, Issue } from 'src/common'
import { fetchFromIssue } from 'src/helpers/fetch'
import { CachedOrPromise, chain } from 'src/helpers/fetch/cached-or-promise'
import { withResponse } from 'src/helpers/response'
import {
    flattenCollectionsToCards,
    flattenFlatCardsToFront,
} from 'src/helpers/transform'
import { ERR_404_REMOTE } from 'src/helpers/words'
import { APIPaths, FSPaths, PathToArticle } from 'src/paths'
import { useCachedOrPromise } from './use-cached-or-promise'

export const useIssueWithResponse = <T>(
    getter: CachedOrPromise<T>,
    deps: unknown[] = [],
) => withResponse<T>(useCachedOrPromise<T>(getter, deps))

export const getIssueResponse = (
    localIssueId: Issue['localId'],
    publishedIssueId: Issue['publishedId'],
) => {
    //TODO: make this work with twin ids
    return fetchFromIssue<Issue>(
        localIssueId,
        FSPaths.issue(localIssueId),
        APIPaths.issue(publishedIssueId),
        {
            validator: res => {
                return res.fronts != null
            },
        },
    )
}

export const useIssueResponse = (issue: {
    localIssueId: Issue['localId']
    publishedIssueId: Issue['publishedId']
}) =>
    useIssueWithResponse(
        getIssueResponse(issue.localIssueId, issue.publishedIssueId),
        [issue],
    )

export const getFrontsResponse = (
    localIssueId: Issue['localId'],
    publishedIssueId: Issue['publishedId'],
    front: Front['key'],
) =>
    fetchFromIssue<Front>(
        localIssueId,
        FSPaths.front(localIssueId, front),
        APIPaths.front(publishedIssueId, front),
        {
            validator: res => res.collections != null,
        },
    )

export const useFrontsResponse = (
    localIssueId: Issue['localId'],
    publishedIssueId: Issue['publishedId'],
    front: Front['key'],
) =>
    useIssueWithResponse(
        getFrontsResponse(localIssueId, publishedIssueId, front),
        [localIssueId, publishedIssueId, front],
    )

export const getArticleResponse = ({
    article,
    localIssueId,
    publishedIssueId,
    front,
}: PathToArticle) =>
    chain(getFrontsResponse(localIssueId, publishedIssueId, front), front => {
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
        path.localIssueId,
        path.publishedIssueId,
    ])
