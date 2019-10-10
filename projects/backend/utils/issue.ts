import { IssuePublicationIdentifier, Edition, Editions } from '../common'
import { Path } from '../s3'

const pickBucket = (asPreview: boolean) => (asPreview ? 'preview' : 'published')

export const getEditionOrFallback = (
    maybeEdition: string | undefined,
): Edition => {
    return (
        (Editions.find(t => t === maybeEdition) as Edition) || 'daily-edition'
    )
}

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
    maybeEdition: string | undefined,
    asPreview: boolean,
): Path => {
    const edition: Edition = getEditionOrFallback(maybeEdition)
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

export const pickIssuePathSegments = (asPreview: boolean) => {
    return asPreview ? ':edition/:date/preview' : ':edition/:date/:version'
}
