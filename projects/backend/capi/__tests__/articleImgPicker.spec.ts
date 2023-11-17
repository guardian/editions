import {
    getImages,
    ImageAndTrailImage,
    getImageRole,
    getCartoonImages,
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
import { CartoonVariant } from '@guardian/content-api-models/v1/cartoonVariant'

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

const blockCartoonElem = (variants?: CartoonVariant[]): BlockElement => {
    return {
        type: ElementType.CARTOON,
        cartoonTypeData: {
            variants: variants ?? [],
        },
        assets: [],
    }
}

const blocks = (element?: BlockElement): Blocks => {
    return {
        main: {
            id: '1',
            bodyHtml: '',
            bodyTextSummary: '',
            elements: [element ?? blockImgEleme],
            contributors: [],
            published: true,
            attributes: {},
        },
    }
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
            blocks: blocks(),
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
            blocks: blocks(),
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

describe('articleImgPicker.getCartoonImages', () => {
    const mobileVariant = {
        viewportSize: 'small',
        images: [
            {
                file: 'https://media.guim.co.uk/63425e0763eb1acf30ad10dc4cdbc5963f3e0944/27_16_951_842/master/951.jpg',
                mimeType: 'image/jpeg',
            },
            {
                file: 'https://media.guim.co.uk/63425e0763eb1acf30ad10dc4cdbc5963f3e0944/982_24_946_837/master/946.jpg',
                mimeType: 'image/jpeg',
            },
        ],
    }
    const desktopVariant = {
        viewportSize: 'large',
        images: [
            {
                file: 'https://media.guim.co.uk/63425e0763eb1acf30ad10dc4cdbc5963f3e0944/0_0_1974_3413/master/1974.jpg',
                mimeType: 'image/jpeg',
            },
        ],
    }

    it('should return mobile images from cartoon main media', () => {
        const variants: CartoonVariant[] = [mobileVariant, desktopVariant]

        const given: Content = {
            ...sharedGiven,
            blocks: blocks(blockCartoonElem(variants)),
        }

        const cartoonImages = getCartoonImages(given)

        const expected = [
            {
                path: '63425e0763eb1acf30ad10dc4cdbc5963f3e0944/27_16_951_842/master/951.jpg',
                source: 'media',
            },
            {
                path: '63425e0763eb1acf30ad10dc4cdbc5963f3e0944/982_24_946_837/master/946.jpg',
                source: 'media',
            },
        ]

        expect(cartoonImages).toEqual(expected)
    })

    it('should default to desktop images if mobile variant is absent', () => {
        const variants: CartoonVariant[] = [desktopVariant]

        const given: Content = {
            ...sharedGiven,
            blocks: blocks(blockCartoonElem(variants)),
        }

        const cartoonImages = getCartoonImages(given)

        const expected = [
            {
                path: '63425e0763eb1acf30ad10dc4cdbc5963f3e0944/0_0_1974_3413/master/1974.jpg',
                source: 'media',
            },
        ]

        expect(cartoonImages).toEqual(expected)
    })

    it('should default to desktop images if a mobile variant is present but has no images', () => {
        const variants: CartoonVariant[] = [
            { viewportSize: 'small', images: [] },
            desktopVariant,
        ]

        const given: Content = {
            ...sharedGiven,
            blocks: blocks(blockCartoonElem(variants)),
        }

        const cartoonImages = getCartoonImages(given)

        const expected = [
            {
                path: '63425e0763eb1acf30ad10dc4cdbc5963f3e0944/0_0_1974_3413/master/1974.jpg',
                source: 'media',
            },
        ]

        expect(cartoonImages).toEqual(expected)
    })

    it('should return undefined if there are no variants', () => {
        const given: Content = {
            ...sharedGiven,
            blocks: blocks(blockCartoonElem()),
        }

        const cartoonImages = getCartoonImages(given)

        expect(cartoonImages).toEqual(undefined)
    })

    it('should return undefined if there variants but no images', () => {
        const given: Content = {
            ...sharedGiven,
            blocks: blocks(
                blockCartoonElem([{ viewportSize: 'small', images: [] }]),
            ),
        }

        const cartoonImages = getCartoonImages(given)

        expect(cartoonImages).toEqual(undefined)
    })

    it('should return undefined if there is no cartoon data', () => {
        const given: Content = {
            ...sharedGiven,
            blocks: blocks(),
        }

        const cartoonImages = getCartoonImages(given)

        expect(cartoonImages).toEqual(undefined)
    })
})
