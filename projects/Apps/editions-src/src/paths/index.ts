import {
    issuePath,
    frontPath,
    Issue,
    Collection,
    Front,
    CAPIArticle,
    ImageSize,
    Image,
    ImageUse,
} from 'src/common'
import RNFetchBlob from 'rn-fetch-blob'
import { defaultSettings } from 'src/helpers/settings/defaults'
import { imagePath } from '@guardian/editions-common'

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
    image: imagePath,
}

const issuesDir = `${RNFetchBlob.fs.dirs.DocumentDir}/issues`

const issueRoot = (localIssueId: string) => `${issuesDir}/${localIssueId}`
const mediaRoot = (localIssueId: string) => `${issueRoot(localIssueId)}/media`

export const FSPaths = {
    issuesDir,
    contentPrefixDir: `${issuesDir}/${defaultSettings.contentPrefix}`,
    issueRoot,
    mediaRoot,
    image: (
        localIssueId: string,
        size: ImageSize,
        image: Image,
        use: ImageUse,
    ) => imagePath(issueRoot(localIssueId), size, image, use),
    zip: (localIssueId: string, filename: string) =>
        `${issueRoot(localIssueId)}/${filename}.zip`,
    issue: (localIssueId: string) => `${issueRoot(localIssueId)}/issue`,
    front: (localIssueId: string, frontId: string) =>
        `${issueRoot(localIssueId)}/front/${frontId}`,
}
