import { useCachedOrPromise } from './use-cached-or-promise'
import { FetchableResponse } from './use-response'
import { fetchFromIssue, ValidatorFn } from 'src/helpers/fetch'
import { Issue, Front, CAPIArticle, Article } from 'src/common'
import { withResponse } from 'src/helpers/response'
import { FSPaths, APIPaths } from 'src/paths'
import { PathToArticle } from 'src/screens/article-screen'
import { flattenCollections } from 'src/helpers/transform'
import { ERR_404_REMOTE } from 'src/helpers/words'
import {
    asPromise,
    createCachedOrPromise,
} from 'src/helpers/fetch/cached-or-promise'

const getIssueResponse = (issue: Issue['key']) =>
    fetchFromIssue<Issue>(issue, FSPaths.issue(issue), APIPaths.issue(issue), {
        validator: res => res.fronts != null,
    })

export const useIssueResponse = (issue: Issue['key']) =>
    withResponse<Issue>(useCachedOrPromise(getIssueResponse(issue)))

const getFrontsResponse = (issue: Issue['key'], front: Front['key']) =>
    fetchFromIssue<Front>(
        issue,
        FSPaths.front(issue, front),
        APIPaths.front(issue, front),
        {
            validator: res => res.collections != null,
        },
    )
export const useFrontsResponse = (issue: Issue['key'], front: Front['key']) =>
    withResponse<Front>(useCachedOrPromise(getFrontsResponse(issue, front)))

export const getArticleResponse = ({ article, issue, front }: PathToArticle) =>
    createCachedOrPromise<Article>(
        [
            null,
            async () => {
                const response = await asPromise(
                    getFrontsResponse(issue, front),
                )
                const allArticles = flattenCollections(response.collections)
                    .map(({ articles }) => articles)
                    .reduce((acc, val) => acc.concat(val), [])
                const articleContent = allArticles.find(
                    ({ key }) => key === article,
                )
                if (articleContent) {
                    return articleContent
                }
                throw ERR_404_REMOTE
            },
        ],
        {
            savePromiseResultToValue: () => {},
        },
    )
export const useArticleResponse = (path: PathToArticle) =>
    withResponse<Article>(useCachedOrPromise(getArticleResponse(path)))
