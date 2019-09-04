import { CAPIArticle } from '../common'
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
        standfirst: '🥇',
        kicker: '🥾',
        trail: '🛣',
        image: image,
        showQuotedHeadline: false,
        mediaType: 'Image',
        elements: [],
    }
    expect(getImagesFromArticle(article)).toContain(image)
})
