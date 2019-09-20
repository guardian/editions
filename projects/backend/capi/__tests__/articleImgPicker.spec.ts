import { getImages, ImageAndTrailImage } from '../articleImgPicker'
import {
    IContent,
    IBlocks,
    IBlockElement,
    ElementType,
    IAsset,
    AssetType,
} from '@guardian/capi-ts'

const masterAsset: IAsset = {
    type: AssetType.IMAGE,
    typeData: { isMaster: true },
    file: 'https://test/master/asset.com',
}
const thumbnailAsset: IAsset = {
    type: AssetType.IMAGE,
    file: 'https://test/thumbnail/asset.com',
}
const blockImgEleme: IBlockElement = {
    type: ElementType.IMAGE,
    assets: [masterAsset],
}

const blocks: IBlocks = {
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
    path: 'master/asset.com',
    source: 'test',
}

const thumbnailExpected = {
    path: 'thumbnail/asset.com',
    source: 'test',
}

describe('articleImgPicker.getImages', () => {
    it('should extracts both images', () => {
        const given: IContent = {
            ...sharedGiven,
            blocks: blocks,
            elements: [thumbnailElem],
        }

        const actual = getImages(given)

        const withBoth: ImageAndTrailImage = {
            image: { ...mainImgExpected },
            trailImage: { ...thumbnailExpected },
        }

        expect(actual).toStrictEqual(withBoth)
    })

    it('should extract only trail image', () => {
        const given: IContent = {
            ...sharedGiven,
            elements: [thumbnailElem],
        }

        const actual = getImages(given)

        const withTrailOnly: ImageAndTrailImage = {
            image: undefined,
            trailImage: { ...thumbnailExpected },
        }

        expect(actual).toStrictEqual(withTrailOnly)
    })

    it('should extract only main image', () => {
        const given: IContent = {
            ...sharedGiven,
            blocks: blocks,
        }

        const actual = getImages(given)

        const withMainOnly: ImageAndTrailImage = {
            image: { ...mainImgExpected },
            trailImage: undefined,
        }

        expect(actual).toStrictEqual(withMainOnly)
    })

    it('should extract no images', () => {
        const given: IContent = {
            ...sharedGiven,
        }

        const actual = getImages(given)

        const withNoImages: ImageAndTrailImage = {
            image: undefined,
            trailImage: undefined,
        }

        expect(actual).toStrictEqual(withNoImages)
    })
})
