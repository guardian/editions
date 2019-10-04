import { IssuePublicationIdentifier } from '../common'
import { Path } from '../s3'

const pickBucket = (asPreview: boolean) => (asPreview ? 'preview' : 'published')

export const getEditionOrFallback = (maybeEdition: string) =>
    maybeEdition || 'daily-edition'

export const buildIssueObjectPath = (
    issue: IssuePublicationIdentifier,
    asPreview: boolean,
): Path => {
    const { edition, issueDate, version } = issue
    return {
        key: `${edition}/${issueDate}/${version}.json`,
        bucket: pickBucket(asPreview),
    }
}

export const buildEditionRootPath = (
    maybeEdition: string,
    asPreview: boolean,
): Path => {
    const edition = getEditionOrFallback(maybeEdition)
    return {
        key: `${edition}/`,
        bucket: pickBucket(asPreview),
    }
}

export const decodeVersionOrPreview = (
    version: string,
    isPreviewStage: boolean,
): string => {
    return decodeURIComponent(isPreviewStage ? 'preview' : version)
}
