import { kickerPicker } from '../kickerPicker'
import { TagType, ContentType } from '@guardian/capi-ts'

type Spec = [TagType, string, string]

const createTag = (spec: Spec) => ({
    id: spec[1],
    type: spec[0],
    webTitle: spec[2],
    webUrl: 'https://gu.com/tag-id',
    apiUrl: 'https://content.gu.com/tag-id',
    references: [],
})

const createArticleLike = (tagSpecs: Spec[]) => ({
    id: 'id',
    type: ContentType.ARTICLE,
    webTitle: 'title',
    webUrl: 'https://gu.com/id',
    apiUrl: 'https://content.gu.com/id',
    tags: tagSpecs.map(createTag),
    references: [],
    isHosted: false,
})

describe('kickerPicker', () => {
    it('picks the series tag over all others', () => {
        const picked = kickerPicker(
            createArticleLike([
                [TagType.KEYWORD, 'some/title', 'some'],
                [TagType.TONE, 'tone/letters', 'letters'],
                [TagType.SERIES, 'tone/letters', 'series'],
            ]),
            'My headline',
            'byline',
        )
        expect(picked).toBe('series')
    })

    it('picks certain tone tags if they are there', () => {
        const picked = kickerPicker(
            createArticleLike([
                [TagType.KEYWORD, 'some/title', 'some'],
                [TagType.TONE, 'tone/letters', 'letters'],
            ]),
            'My headline',
            'byline',
        )
        expect(picked).toBe('letters')
    })

    it('removes the last character from some other tone tags', () => {
        const picked = kickerPicker(
            createArticleLike([
                [TagType.KEYWORD, 'some/title', 'some'],
                [TagType.TONE, 'tone/matchreports', 'reports'],
            ]),
            'My headline',
            'byline',
        )
        expect(picked).toBe('report')
    })

    it('pieces with the comment tone use the byline', () => {
        const picked = kickerPicker(
            createArticleLike([
                [TagType.KEYWORD, 'some/title', 'some'],
                [TagType.TONE, 'tone/comment', 'comments'],
            ]),
            'My headline',
            'byline',
        )
        expect(picked).toBe('byline')
    })

    it('expect certain tone tags to be picked over all others', () => {
        const picked = kickerPicker(
            createArticleLike([
                [TagType.KEYWORD, 'some/title', 'some'],
                [TagType.TONE, 'tone/letters', 'letters'],
            ]),
            'My headline',
            'byline',
        )
        expect(picked).toBe('letters')
    })

    it('picks the top tag title when there are no series / tone tags', () => {
        const picked = kickerPicker(
            createArticleLike([
                [TagType.KEYWORD, 'some/title', 'some'],
                [TagType.KEYWORD, 'another/title', 'another'],
            ]),
            'My headline',
            'byline',
        )
        expect(picked).toBe('some')
    })

    it('picks the second tag when the first tag title is already in the headline', () => {
        const picked = kickerPicker(
            createArticleLike([
                [TagType.KEYWORD, 'some/title', 'headline stuff'],
                [TagType.KEYWORD, 'another/title', 'another'],
            ]),
            'HeadLine StuFF',
        )
        expect(picked).toBe('another')
    })

    it('picks the top tag when both the first tag and second titles are already in the headline', () => {
        const picked = kickerPicker(
            createArticleLike([
                [TagType.KEYWORD, 'some/title', 'headline stuff 1'],
                [TagType.KEYWORD, 'another/title', 'headline stuff 2'],
            ]),
            'HeadLine StuFF',
        )
        expect(picked).toBe('headline stuff 1')
    })

    it('returns undefined when there are no tags', () => {
        const picked = kickerPicker(createArticleLike([]), 'HeadLine StuFF')
        expect(picked).toBeUndefined()
    })
})
