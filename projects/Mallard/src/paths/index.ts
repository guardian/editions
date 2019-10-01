import {
    issuePath,
    mediaPath,
    frontPath,
    Issue,
    Collection,
    Front,
    CAPIArticle,
} from 'src/common'
import RNFetchBlob from 'rn-fetch-blob'

export interface PathToIssue {
    localIssueId: Issue['localId']
    publishedIssueId: Issue['publishedId']
}

export interface PathToArticle {
    collection: Collection['key']
    front: Front['key']
    article: CAPIArticle['key']
    localIssueId: Issue['localId']
    publishedIssueId: Issue['publishedId']
}

export const APIPaths = {
    issue: issuePath,
    front: frontPath,
    media: mediaPath,
}

const issuesDir = `${RNFetchBlob.fs.dirs.DocumentDir}/issues`

const issueRoot = (localIssueId: string) => `${issuesDir}/${localIssueId}`
const mediaRoot = (localIssueId: string) => `${issueRoot(localIssueId)}/media`
export const MEDIA_CACHE_DIRECTORY_NAME = 'cached'

export const FSPaths = {
    issuesDir,
    issueRoot,
    mediaRoot,
    media: (localIssueId: string, source: string, path: string) =>
        `${mediaRoot(
            localIssueId,
        )}/${MEDIA_CACHE_DIRECTORY_NAME}/${source}/${path}`,
    zip: (localIssueId: string, filename: string) =>
        `${issueRoot(localIssueId)}/${filename}.zip`,
    issueZip: (localIssueId: string) => `${issueRoot(localIssueId)}/data.zip`,
    issue: (localIssueId: string) => `${issueRoot(localIssueId)}/issue`,
    front: (localIssueId: string, frontId: string) =>
        `${issueRoot(localIssueId)}/front/${frontId}`,
}
