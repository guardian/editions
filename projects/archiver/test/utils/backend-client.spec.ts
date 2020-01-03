import { attempt, Front, IssuePublicationIdentifier } from '../../common'
import { Bucket } from '../../src/utils/s3'

const frontJson: any = {
    id: 'id1',
    name: 'name1',
    collections: [
        {
            key: '0:Features',
            cards: [
                {
                    appearance: 'splash',
                    articles: {
                        one: {
                            type: 'article',
                            path: 'one',
                            headline: 'headline1',
                            kicker: 'kicker1',
                            articleType: 'review',
                            trail: 'trail1',
                            image: {
                                source: 'media',
                                path: 'path1',
                                credit: 'Photograph: SpunGold TV',
                                caption: 'caption1',
                                displayCredit: true,
                            },
                            byline: 'Joel Golby',
                            bylineHtml: 'bylineHtml1',
                            standfirst: 'standfirst1',
                            elements: [
                                {
                                    id: 'html',
                                    html: 'html1',
                                },
                            ],
                            isFromPrint: true,
                            key: 'one',
                            showByline: false,
                            showQuotedHeadline: false,
                            mediaType: 'useArticleTrail',
                            trailImage: {
                                source: 'media',
                                path: 'path1',
                                credit: 'Photograph: SpunGold TV',
                                caption: 'caption1',
                                displayCredit: true,
                                use: {
                                    mobile: 'full-size',
                                    tablet: 'full-size',
                                },
                            },
                        },
                    },
                },
            ],
        },
    ],
}

describe('parse capi response', () => {
    it('should return correctly parsed result of capi response', async () => {
        const maybeFront = frontJson as Front
        const maybeTrailImage =
            maybeFront.collections[0].cards[0].articles.one.trailImage
        expect(typeof maybeTrailImage).toBe('object')
    })
})
