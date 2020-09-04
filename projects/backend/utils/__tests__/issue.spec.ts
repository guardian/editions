import {
    buildIssueObjectPath,
    buildEditionRootPath,
    decodeVersionOrPreview,
    pickIssuePathSegments,
    getEditionOrFallback,
} from '../issue'
import { IssuePublicationIdentifier, Edition } from '../../common'
import { Path } from '../../s3'

const issueDate = '2019-09-11'
const version = '2019-10-04T11:28:04.07Z'
const dailyEdition: Edition = 'daily-edition'
const usEdition: Edition = 'american-edition'

const issue: IssuePublicationIdentifier = {
    issueDate,
    version,
    edition: dailyEdition,
}

describe('getEditionOrFallback', () => {
    it('should get edition provided', () => {
        expect(getEditionOrFallback(usEdition)).toStrictEqual(usEdition)
    })
    it('should fallback to daily-edition', () => {
        expect(getEditionOrFallback('')).toStrictEqual(dailyEdition)
        expect(getEditionOrFallback(undefined)).toStrictEqual(dailyEdition)
    })
})

describe('buildIssueObjectPath', () => {
    it('should build preview path', () => {
        const isPreview = true
        const actual = buildIssueObjectPath(issue, isPreview)
        const expected: Path = {
            key: 'daily-edition/2019-09-11/2019-10-04T11:28:04.07Z.json',
            bucket: 'preview',
        }
        expect(actual).toStrictEqual(expected)
    })
    it('should build published path', () => {
        const isPreview = false
        const actual = buildIssueObjectPath(issue, isPreview)
        const expected: Path = {
            key: 'daily-edition/2019-09-11/2019-10-04T11:28:04.07Z.json',
            bucket: 'published',
        }
        expect(actual).toStrictEqual(expected)
    })
})

describe('buildEditionRootPath', () => {
    it('should get preview edition path for edition provided', () => {
        const isPreview = true
        const actual = buildEditionRootPath(usEdition, isPreview)
        const expected: Path = {
            key: `${usEdition}/`,
            bucket: 'preview',
        }
        expect(actual).toStrictEqual(expected)
    })
    it('should get published edition path for edition provided', () => {
        const isPreview = false
        const actual = buildEditionRootPath(usEdition, isPreview)
        const expected: Path = {
            key: `${usEdition}/`,
            bucket: 'published',
        }
        expect(actual).toStrictEqual(expected)
    })
    it('should get preview edition path with fallback to daily-edition', () => {
        const isPreview = true
        const expected: Path = {
            key: 'daily-edition/',
            bucket: 'preview',
        }
        expect(buildEditionRootPath('', isPreview)).toStrictEqual(expected)
        expect(buildEditionRootPath(undefined, isPreview)).toStrictEqual(
            expected,
        )
    })
    it('should get published edition path with fallback to daily-edition', () => {
        const isPreview = false
        const expected: Path = {
            key: 'daily-edition/',
            bucket: 'published',
        }
        expect(buildEditionRootPath('', isPreview)).toStrictEqual(expected)
        expect(buildEditionRootPath(undefined, isPreview)).toStrictEqual(
            expected,
        )
    })
})

describe('decodeVersionOrPreview', () => {
    it('should fallback to preview', () => {
        const isPreviewStage = true
        expect(
            decodeVersionOrPreview('some%20version', isPreviewStage),
        ).toStrictEqual('preview')
    })
    it('should decode version', () => {
        const isPreviewStage = false
        expect(
            decodeVersionOrPreview('some%20version', isPreviewStage),
        ).toStrictEqual('some version')
    })
})

describe('pickIssuePathSegments', () => {
    it('should fallback to preview', () => {
        const isPreview = true
        expect(pickIssuePathSegments(isPreview)).toStrictEqual(
            ':edition/:date/preview',
        )
    })
    it('should pick versioned path segments', () => {
        const isPreview = false
        expect(pickIssuePathSegments(isPreview)).toStrictEqual(
            ':edition/:date/:version',
        )
    })
})
