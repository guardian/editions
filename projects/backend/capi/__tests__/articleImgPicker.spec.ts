
import { getImages, ImageAndTrailImage } from '../articleImgPicker'
import { IContent, IBlock, IBlocks, IBlockElement, ElementType, IAssetFields, IAsset, AssetType } from '@guardian/capi-ts'

describe('articleImgPicker.getImages', () => {
    it('should extracts imigaes', () => {
        const masterAsset: IAsset = {
            type: AssetType.IMAGE
        }
        const blockImgEleme: IBlockElement = {
            type: ElementType.IMAGE, 
            assets: [masterAsset],
        }
        const block: IBlocks = {
            main: {
                id: "1",
                bodyHtml: "",
                bodyTextSummary: "",
                elements: [blockImgEleme],
                contributors: [],
                published: true,
                attributes: {}
            }
        }
        const given: IContent = {
            id: "fgg",
            type: 0,
            webTitle: "fdg",
            webUrl: "fgg",
            apiUrl: "fgg",
            tags: [],
            references: [],
            isHosted: false
        }
        const actual = getImages(given)

        const expected: ImageAndTrailImage = { image: undefined, trailImage: undefined }
        expect(actual).toStrictEqual(expected)
    })
})