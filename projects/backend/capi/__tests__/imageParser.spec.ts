import { parseImageElement } from '../elements'
import { ElementType } from '@guardian/content-api-models/v1/elementType'
import { ImageElementFields } from '@guardian/content-api-models/v1/imageElementFields'
import { Asset } from '@guardian/content-api-models/v1/asset'
import { AssetType } from '@guardian/content-api-models/v1/assetType'
import { BlockElement } from '@guardian/content-api-models/v1/blockElement'
import {
    BlockElement as EditionsBlockElement,
    ImageElement,
} from '../../../Apps/common/src'

const createImageAssetLike: Asset = {
    type: AssetType.IMAGE,
    mimeType: 'image/jpeg',
    file: 'https://test/image/asset.comg',
}

const createImageElementFields: ImageElementFields = {
    caption: `£price <a href"http://gallerylink.com"> guardian.com</a>"`,
}
const createImageBlockElementLike: BlockElement = {
    type: ElementType.IMAGE,
    assets: [createImageAssetLike],
    imageTypeData: createImageElementFields,
}

describe('imageParser', () => {
    it('the parsed image element contains a href link', () => {
        const parsed: EditionsBlockElement | undefined = parseImageElement(
            createImageBlockElementLike,
        )
        expect((parsed as ImageElement).caption).toContain(
            '<a href"http://gallerylink.com"> guardian.com</a>',
        )
    })
})
