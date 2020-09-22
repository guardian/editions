import { IssuePublicationIdentifier, EditionId } from '../common'
import { Path, getFrontsBucket } from '../s3'

export const getEditionOrFallback = (
    maybeEdition: string | undefined,
): EditionId => {
    return maybeEdition || 'daily-edition'
}

export const buildIssueObjectPath = (
    issue: IssuePublicationIdentifier,
    asPreview: boolean,
): Path => {
    const { edition, issueDate, version } = issue
    return {
        key: `${edition}/${issueDate}/${version}.json`,
        bucket: getFrontsBucket(asPreview),
    }
}

export const buildEditionRootPath = (
    maybeEdition: string | undefined,
    asPreview: boolean,
): Path => {
    const edition: EditionId = getEditionOrFallback(maybeEdition)
    return {
        key: `${edition}/`,
        bucket: getFrontsBucket(asPreview),
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
