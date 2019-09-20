
import { getImages, ImageAndTrailImage } from '../articleImgPicker'
import { IContent, IBlock, IBlocks, IBlockElement, ElementType, IAssetFields, IAsset, AssetType, AssetFields } from '@guardian/capi-ts'

describe('articleImgPicker.getImages', () => {
    it('should extracts imigaes', () => {
        const masterAsset: IAsset = {
            type: AssetType.IMAGE,
            typeData: { isMaster: true },
            file: "https://test/master/asset.com"
        }
        const blockImgEleme: IBlockElement = {
            type: ElementType.IMAGE,
            assets: [masterAsset],
        }
        const blocks: IBlocks = {
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
            id: "test",
            blocks: blocks,
            type: 0,
            webTitle: "title",
            webUrl: "http://test",
            apiUrl: "http://api.test",
            tags: [],
            references: [],
            isHosted: false
        }
        const actual = getImages(given)

        const withMainImg: ImageAndTrailImage = { 
            image: {
                credit: undefined,
                path: "master/asset.com",
                source: "test"
            }, 
            trailImage: undefined }

        expect(actual).toStrictEqual(withMainImg)
    })
})