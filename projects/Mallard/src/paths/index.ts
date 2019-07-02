import { issuePath, mediaPath, collectionPath, frontPath } from 'src/common'
import RNFetchBlob from 'rn-fetch-blob'

const APIPaths = {
    issue: issuePath,
    collection: collectionPath,
    front: frontPath,
    media: mediaPath,
    mediaBackend: 'https://d2cf1ljtg904cv.cloudfront.net/',
}

const issuesDir = `${RNFetchBlob.fs.dirs.DocumentDir}/issues`

const issueRoot = (issueId: string) => `${issuesDir}/${issueId}`

const FSPaths = {
    issuesDir,
    issueRoot,
    issueZip: (issueId: string) => `${issueRoot(issueId)}.zip`,
    issue: (issueId: string) => `${issueRoot(issueId)}/issue`,
    collection: (issueId: string, collectionId: string) =>
        `${issueRoot(issueId)}/collection/${collectionId}`,
    front: (issueId: string, frontId: string) =>
        `${issueRoot(issueId)}/front/${frontId}`,
}

export { FSPaths, APIPaths }
