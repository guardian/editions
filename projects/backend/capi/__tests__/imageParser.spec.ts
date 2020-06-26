import { parseImageElement } from '../elements'
import {
    ElementType,
    AssetType,
    IBlockElement,
    IAsset,
    IImageElementFields,
} from '@guardian/capi-ts'
import { BlockElement, ImageElement } from '../../../Apps/common/src'

const createImageAssetLike: IAsset = {
    type: AssetType.IMAGE,
    mimeType: 'image/jpeg',
    file: 'https://test/image/asset.comg',
}

const createImageElementFields: IImageElementFields = {
    caption: `£price <a href"http://gallerylink.com"> guardian.com</a>"`,
}
const createImageBlockElementLike: IBlockElement = {
    type: ElementType.IMAGE,
    assets: [createImageAssetLike],
    imageTypeData: createImageElementFields,
}

describe('imageParser', () => {
    it('the parsed image element contains a href link', () => {
        const parsed: BlockElement | undefined = parseImageElement(
            createImageBlockElementLike,
        )
        expect((parsed as ImageElement).caption).toContain(
            '<a href"http://gallerylink.com"> guardian.com</a>',
        )
    })
})
