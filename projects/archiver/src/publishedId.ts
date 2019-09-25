import { IssuePublicationIdentifier, IssueIdentifier } from '../common'

export const getPublishedId = (issuePublication: IssuePublicationIdentifier) =>
    `${issuePublication.edition}/${issuePublication.issueDate}/${issuePublication.version}`

export const getLocalId = (
    issuePublication: IssueIdentifier,
) => `${issuePublication.edition}/${issuePublication.issueDate}`
