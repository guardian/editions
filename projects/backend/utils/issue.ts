import { IssuePublicationIdentifier } from '../common'
import { Path } from '../s3'

export const issueObjectPathBuilder = (
    issue: IssuePublicationIdentifier,
    asPreview: boolean,
): Path => {
    const { edition, issueDate, version } = issue
    return {
        key: `${edition}/${issueDate}/${version}.json`,
        bucket: asPreview ? 'preview' : 'published',
    }
}

export const getEditionOrFallback = (editionType: string) =>
    editionType ? editionType : 'daily-edition'
