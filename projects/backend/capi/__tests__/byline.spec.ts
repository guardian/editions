import { getBylineImages } from '../byline'
import { TagType } from '@guardian/content-api-models/v1/tagType'
import { Content } from '@guardian/content-api-models/v1/content'
import { ContentType } from '@guardian/content-api-models/v1/contentType'
interface TagSpec {
    id: string
    type: TagType
    webTitle: string
    bylineImageUrl?: string
    bylineLargeImageUrl?: string
}

const createTag = ({
    id,
    type,
    webTitle,
    bylineImageUrl,
    bylineLargeImageUrl,
}: TagSpec) => ({
    id,
    type,
    webTitle,
    webUrl: 'https://gu.com/tag-id',
    apiUrl: 'https://content.gu.com/tag-id',
    references: [],
    bylineImageUrl,
    bylineLargeImageUrl,
})

const createArticleLike = (tagSpecs: TagSpec[], byline: string): Content => ({
    id: 'id',
    type: ContentType.ARTICLE,
    fields: {
        byline,
    },
    webTitle: 'title',
    webUrl: 'https://gu.com/id',
    apiUrl: 'https://content.gu.com/id',
    tags: tagSpecs.map(createTag),
    references: [],
    isHosted: false,
})

describe('byline image extractor', () => {
    it('extracts matching contributor tags', () => {
        const tagSpecs: TagSpec[] = [
            {
                id: 'a',
                type: TagType.KEYWORD,
                webTitle: '',
                bylineImageUrl: '',
                bylineLargeImageUrl: '',
            },
            {
                id: 'Name',
                type: TagType.CONTRIBUTOR,
                webTitle: '',
                bylineImageUrl: 'https://test.gu.com/image',
                bylineLargeImageUrl: 'https://test.gu.com/image2',
            },
        ]
        const article = createArticleLike(tagSpecs, 'Name')
        const images = getBylineImages(article)
        expect(images).toStrictEqual({
            cutout: {
                source: 'test',
                path: 'image2',
                role: undefined,
            },
        })
    })
})
