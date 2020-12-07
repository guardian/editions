import {
    getImages,
    ImageAndTrailImage,
    getImageRole,
} from '../articleImgPicker'
import { Asset } from '@guardian/content-api-models/v1/asset'
import { AssetType } from '@guardian/content-api-models/v1/assetType'
import { BlockElement } from '@guardian/content-api-models/v1/blockElement'
import { Content } from '@guardian/content-api-models/v1/content'
import { Blocks } from '@guardian/content-api-models/v1/blocks'
import { ElementType } from '@guardian/content-api-models/v1/elementType'
import { ContentType } from '@guardian/content-api-models/v1/contentType'
import { articleTypePicker } from '../articleTypePicker'
import { ArticleType } from '../../../Apps/common/src'

const masterAsset: Asset = {
    type: AssetType.IMAGE,
    typeData: { isMaster: true },
    file: 'https://test/master/asset.com',
}
const thumbnailAsset: Asset = {
    type: AssetType.IMAGE,
    file: 'https://test/thumbnail/asset.com',
}
const blockImgEleme: BlockElement = {
    type: ElementType.IMAGE,
    assets: [masterAsset],
}

const blocks: Blocks = {
    main: {
        id: '1',
        bodyHtml: '',
        bodyTextSummary: '',
        elements: [blockImgEleme],
        contributors: [],
        published: true,
        attributes: {},
    },
}

const thumbnailElem = {
    id: 'thumbnail',
    relation: 'thumbnail',
    type: ElementType.IMAGE,
    assets: [thumbnailAsset],
}

const sharedGiven = {
    id: 'test',
    type: 0,
    webTitle: 'title',
    webUrl: 'http://test',
    apiUrl: 'http://api.test',
    tags: [],
    references: [],
    isHosted: false,
}

const mainImgExpected = {
    credit: undefined,
    caption: undefined,
    displayCredit: undefined,
    path: 'master/asset.com',
    source: 'test',
    role: undefined,
}

const thumbnailExpected = {
    path: 'thumbnail/asset.com',
    source: 'test',
}

const articleType = articleTypePicker(sharedGiven)

describe('articleImgPicker.getImages', () => {
    it('should extract both images', () => {
        const given: Content = {
            ...sharedGiven,
            blocks: blocks,
            elements: [thumbnailElem],
        }

        const actual = getImages(given, articleType)

        const withBoth: ImageAndTrailImage = {
            image: { ...mainImgExpected },
            trailImage: {
                ...thumbnailExpected,
                use: {
                    mobile: 'full-size',
                    tablet: 'full-size',
                },
                role: undefined,
            },
        }

        expect(actual).toStrictEqual(withBoth)
    })

    it('should extract only trail image', () => {
        const given: Content = {
            ...sharedGiven,
            elements: [thumbnailElem],
        }

        const actual = getImages(given, articleType)

        const withTrailOnly: ImageAndTrailImage = {
            image: undefined,
            trailImage: {
                ...thumbnailExpected,
                use: {
                    mobile: 'full-size',
                    tablet: 'full-size',
                },
                role: undefined,
            },
        }

        expect(actual).toStrictEqual(withTrailOnly)
    })

    it('should extract only main image', () => {
        const given: Content = {
            ...sharedGiven,
            blocks: blocks,
        }

        const actual = getImages(given, articleType)

        const withMainOnly: ImageAndTrailImage = {
            image: { ...mainImgExpected },
            trailImage: undefined,
        }

        expect(actual).toStrictEqual(withMainOnly)
    })

    it('should extract no images', () => {
        const given: Content = {
            ...sharedGiven,
        }

        const actual = getImages(given, articleType)

        const withNoImages: ImageAndTrailImage = {
            image: undefined,
            trailImage: undefined,
        }

        expect(actual).toStrictEqual(withNoImages)
    })
})

describe('getImageRole', () => {
    it('should return immersive for displayHint=immersive when capirole is undefined', async () => {
        const role = getImageRole(ArticleType.Feature, 'immersive', undefined)
        expect(role).toBe('immersive')
    })

    it('should return the capi role when it is defined', async () => {
        const role = getImageRole(ArticleType.Feature, 'immersive', 'showcase')
        expect(role).toBe('showcase')
    })

    it('returns undefined when no valid roles provided', async () => {
        const role = getImageRole(ArticleType.Feature, 'hehe', 'megabigimage')
        expect(role).toBe(undefined)
    })

    it('returns immersive for ArticleType=Immersive when capirole is undefined', async () => {
        const role = getImageRole(ArticleType.Immersive, undefined, undefined)
        expect(role).toBe('immersive')
    })

    it('returns immersive for picture content when capirole is undefined', async () => {
        const role = getImageRole(
            ArticleType.Feature,
            undefined,
            undefined,
            ContentType.PICTURE,
        )
        expect(role).toBe('immersive')
    })
})
