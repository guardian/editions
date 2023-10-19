import { Content } from '@guardian/content-api-models/v1/content'
import { ImageElement } from '../common'
import { ContentType } from '@guardian/content-api-models/v1/contentType'
import { ElementType } from '@guardian/content-api-models/v1/elementType'
import { BlockElement } from '@guardian/content-api-models/v1/blockElement'
import { CartoonImage } from '@guardian/content-api-models/v1/cartoonImage'
import { getImageFromURL } from '../image'
import { CartoonElementFields } from '@guardian/content-api-models/v1/cartoonElementFields'

// change this to default to large (desktop) or small (mobile) images
const DEFAULT_VIEWPORT: 'large' | 'small' = 'small'

const convertCartoonImageToImageElement = (
    cartoonImage: CartoonImage,
    typeData: CartoonElementFields,
): ImageElement | undefined => {
    const src = getImageFromURL(cartoonImage.file, { role: typeData?.role })
    return (
        src && {
            id: 'image',
            src,
            alt: typeData?.alt,
            caption: typeData?.caption,
            credit: typeData?.credit,
            displayCredit: typeData?.displayCredit,
            role: typeData?.role,
        }
    )
}

const convertCartoonElementToImageElements = (
    element: BlockElement,
): ImageElement[] => {
    if (element.type !== ElementType.CARTOON) {
        return []
    }
    const typeData: CartoonElementFields = element.cartoonTypeData ?? {}
    const images: CartoonImage[] =
        typeData.variants?.find(
            (variant) => variant.viewportSize === DEFAULT_VIEWPORT,
        )?.images ?? []

    return images
        .map((img) => convertCartoonImageToImageElement(img, typeData))
        .filter((image): image is ImageElement => {
            return !!image
        })
}

const maybeImageElementsFromCartoon = (
    content: Content,
): ImageElement[] | undefined => {
    if (
        content.type === ContentType.PICTURE &&
        content.blocks?.main?.elements?.some(
            (element) => element.type === ElementType.CARTOON,
        )
    ) {
        const mainElements = content.blocks?.main?.elements ?? []
        const imageElements = mainElements.map((element) =>
            convertCartoonElementToImageElements(element),
        )

        return imageElements.reduce((acc, curr) => {
            return acc.concat(curr)
        }, [])
    }
}

export { maybeImageElementsFromCartoon }
