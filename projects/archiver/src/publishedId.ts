import { IssuePublication } from '../common'

export const getPublishedId = (issuePublication: IssuePublication) =>
    `${issuePublication.edition}/${issuePublication.issueDate}/${issuePublication.version}`

export const getLocalId = (
    issuePublication: Omit<IssuePublication, 'version'>,
) => `${issuePublication.edition}/${issuePublication.issueDate}`
