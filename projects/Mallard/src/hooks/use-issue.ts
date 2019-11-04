import { Issue } from 'src/common'
import { fetchIssue } from 'src/helpers/fetch'
import { CachedOrPromise, chain } from 'src/helpers/fetch/cached-or-promise'
import { withResponse } from 'src/helpers/response'
import {
    flattenCollectionsToCards,
    flattenFlatCardsToFront,
} from 'src/helpers/transform'
import { ERR_404_REMOTE } from 'src/helpers/words'
import { PathToArticle } from 'src/paths'
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
    return fetchIssue(localIssueId, publishedIssueId)
}

export const useIssueResponse = (issue: {
    localIssueId: Issue['localId']
    publishedIssueId: Issue['publishedId']
}) =>
    useIssueWithResponse(
        getIssueResponse(issue.localIssueId, issue.publishedIssueId),
        [issue],
    )

export const getArticleResponse = ({
    article,
    localIssueId,
    publishedIssueId,
    front,
}: PathToArticle) =>
    chain(getIssueResponse(localIssueId, publishedIssueId), issue => {
        const maybeFront = issue.fronts.find(f => f.key === front)
        if (!maybeFront) throw ERR_404_REMOTE

        const allArticles = flattenFlatCardsToFront(
            flattenCollectionsToCards(maybeFront.collections),
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
