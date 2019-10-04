import {
    buildIssueObjectPath,
    buildEditionRootPath,
    decodeVersionOrPreview,
} from '../issue'
import { IssuePublicationIdentifier } from '../../common'
import { Path } from '../../s3'

const issueDate = '2019-09-11'
const version = '2019-10-04T11:28:04.07Z'
const edition = 'daily-edition'

const issue: IssuePublicationIdentifier = {
    issueDate,
    version,
    edition,
}

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
        const actual = buildEditionRootPath('other-edition', isPreview)
        const expected: Path = {
            key: 'other-edition/',
            bucket: 'preview',
        }
        expect(actual).toStrictEqual(expected)
    })
    it('should get published edition path for edition provided', () => {
        const isPreview = false
        const actual = buildEditionRootPath('other-edition', isPreview)
        const expected: Path = {
            key: 'other-edition/',
            bucket: 'published',
        }
        expect(actual).toStrictEqual(expected)
    })
    it('should get preview edition path with fallback to daily-edition', () => {
        const isPreview = true
        const actual = buildEditionRootPath('', isPreview)
        const expected: Path = {
            key: 'daily-edition/',
            bucket: 'preview',
        }
        expect(actual).toStrictEqual(expected)
    })
    it('should get published edition path with fallback to daily-edition', () => {
        const isPreview = false
        const actual = buildEditionRootPath('', isPreview)
        const expected: Path = {
            key: 'daily-edition/',
            bucket: 'published',
        }
        expect(actual).toStrictEqual(expected)
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
