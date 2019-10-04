import { IssuePublicationIdentifier } from '../common'
import { Path } from '../s3'

export const buildIssueObjectPath = (
    issue: IssuePublicationIdentifier,
    asPreview: boolean,
): Path => {
    const { edition, issueDate, version } = issue
    return {
        key: `${edition}/${issueDate}/${version}.json`,
        bucket: asPreview ? 'preview' : 'published',
    }
}

export const getEditionOrFallback = (maybeEdition: string) =>
    maybeEdition ? maybeEdition : 'daily-edition'
