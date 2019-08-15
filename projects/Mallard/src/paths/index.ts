import { issuePath, mediaPath, frontPath, Image } from 'src/common'
import RNFetchBlob from 'rn-fetch-blob'

const APIPaths = {
    issue: issuePath,
    front: frontPath,
    media: mediaPath,
    mediaBackend: 'https://d2cf1ljtg904cv.cloudfront.net/', // TODO: Use s3 issue paths.
}

const issuesDir = `${RNFetchBlob.fs.dirs.DocumentDir}/issues`

const imagePath = (image: Image) =>
    `${APIPaths.mediaBackend}${APIPaths.media(
        'issue',
        'phone',
        image.source,
        image.path,
    )}`

const issueRoot = (issueId: string) => `${issuesDir}/${issueId}`

const FSPaths = {
    issuesDir,
    issueRoot,
    issueZip: (issueId: string) => `${issueRoot(issueId)}.zip`,
    issue: () => issuesDir,
    collection: (issueId: string, collectionId: string) =>
        `${issueRoot(issueId)}/collection/${collectionId}`,
    front: (issueId: string, frontId: string) =>
        `${issueRoot(issueId)}/front/${frontId}`,
}

export { FSPaths, APIPaths, imagePath }
