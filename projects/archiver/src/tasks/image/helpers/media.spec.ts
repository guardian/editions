import { CAPIArticle } from '../../../../common'
import { getImagesFromArticle } from './media'

test('getImage', () => {
    const image = {
        source: 'test',
        path: 'image',
    }
    const article: CAPIArticle = {
        key: '🔑',
        type: 'article',
        headline: '🗣',
        showByline: false,
        byline: '🧬',
        bylineHtml: '<a>🧬</<a> Senior person',
        standfirst: '🥇',
        kicker: '🥾',
        trail: '🛣',
        image: image,
        showQuotedHeadline: false,
        mediaType: 'Image',
        elements: [],
        fromPrint: true,
    }
    expect(getImagesFromArticle(article)).toContain(image)
})
