import { patchArticle, getImages, patchArticleElements } from '../fronts'
import {
    Article,
    PublishedFurniture as PublishedFurnitureFixture,
} from './helpers/fixtures'
import { CAPIContent } from '../capi/articles'
import {
    PublishedFurniture,
    PublishedImage,
    PublishedCardImage,
} from '../fronts/issue'
import { CreditedImage, ArticleType, Image } from '../../common/src'

const notUsed = {
    use: {
        mobile: 'not-used',
        tablet: 'not-used',
    },
}

describe('fronts', () => {
    describe('patchArticle', () => {
        describe('trail and standfirst', () => {
            it('takes the furniture value for trail if it exists', () => {
                const patched = patchArticle(
                    Article({ key: 'my-article', trail: 'article' }),
                    PublishedFurnitureFixture({
                        trailTextOverride: 'furniture',
                    }),
                    {
                        mobile: 'not-used',
                        tablet: 'not-used',
                    },
                )[1]
                expect(patched.trail).toBe('furniture')
                expect(patched.trail).toBe(patched.standfirst)
            })

            it('takes the article value for trail when furniture is falsey', () => {
                const p1 = patchArticle(
                    Article({ key: 'my-article', trail: 'article' }),
                    PublishedFurnitureFixture({ trailTextOverride: '' }),
                    {
                        mobile: 'not-used',
                        tablet: 'not-used',
                    },
                )[1]
                expect(p1.trail).toBe('article')
                expect(p1.trail).toBe(p1.standfirst)

                const p2 = patchArticle(
                    Article({ key: 'my-article', trail: 'article' }),
                    PublishedFurnitureFixture(),
                    {
                        mobile: 'not-used',
                        tablet: 'not-used',
                    },
                )[1]
                expect(p2.trail).toBe(p2.standfirst)
            })

            it('strips html tags from the fields', () => {
                const patched = patchArticle(
                    Article({
                        key: 'my-article',
                        trail:
                            '<strong>here is <em>something</em> important</strong>',
                    }),
                    PublishedFurnitureFixture({ trailTextOverride: '' }),
                    {
                        mobile: 'not-used',
                        tablet: 'not-used',
                    },
                )[1]
                expect(patched.trail).toBe('here is something important')
                expect(patched.trail).toBe(patched.standfirst)
            })
        })
    })

    describe('patchArticleElements', () => {
        it('should add drop caps for the first html element only in certain `articleType`s', () => {
            const els = patchArticleElements({
                articleType: ArticleType.Feature,
                elements: [
                    { id: 'html', html: '<p>hi</p>' },
                    { id: 'html', html: '<p>hi</p>' },
                ],
            })

            expect(els[0]).toMatchObject({
                hasDropCap: true,
            })
        })

        it('should ignore non-html elements in first position', () => {
            const els = patchArticleElements({
                articleType: ArticleType.Feature,
                elements: [
                    { id: 'unknown' },
                    { id: 'html', html: '<p>hi</p>' },
                ],
            })

            expect(els[0]).not.toMatchObject({
                hasDropCap: true,
            })

            expect(els[1]).not.toMatchObject({
                hasDropCap: true,
            })
        })
    })

    describe('fronts.getImages', () => {
        const mainImage: CreditedImage = {
            credit: undefined,
            path: 'master/asset.com',
            source: 'test',
        }

        const trailImg: Image = {
            path: 'trail/asset.com',
            source: 'test',
        }

        const pubImg: PublishedImage = {
            height: 1,
            width: 2,
            src: 'https://test/pub.img',
        }

        const pubImages: PublishedCardImage = { mobile: pubImg, tablet: pubImg }

        describe('main image', () => {
            it('should extract main image and trail image as main image', () => {
                const article: CAPIContent = Article({
                    key: 'my-article',
                    trail: 'article',
                    image: mainImage,
                    trailImage: trailImg,
                })
                const furniture: PublishedFurniture = PublishedFurnitureFixture(
                    {
                        trailTextOverride: '',
                    },
                )

                const { image: actual } = getImages(article, furniture, {
                    mobile: 'not-used',
                    tablet: 'not-used',
                })

                const expected = mainImage
                expect(actual).toStrictEqual(expected)
            })

            it('should override main image when override main media is true', () => {
                const article: CAPIContent = Article({
                    key: 'my-article',
                    trail: 'article',
                    image: mainImage,
                    trailImage: trailImg,
                })
                const furniture: PublishedFurniture = PublishedFurnitureFixture(
                    {
                        trailTextOverride: '',
                        overrideArticleMainMedia: true,
                        imageSrcOverride: pubImg,
                    },
                )

                const { image: actual } = getImages(article, furniture, {
                    mobile: 'not-used',
                    tablet: 'not-used',
                })

                const expected = { path: 'pub.img', source: 'test' }
                expect(actual).toStrictEqual(expected)
            })
        })

        describe('trail image', () => {
            it('should be main image when provided', () => {
                const article: CAPIContent = Article({
                    key: 'my-article',
                    trail: 'article',
                    image: mainImage,
                    trailImage: trailImg,
                })
                const furniture: PublishedFurniture = PublishedFurnitureFixture(
                    {
                        trailTextOverride: '',
                    },
                )

                const { trailImage: actual } = getImages(article, furniture, {
                    mobile: 'not-used',
                    tablet: 'not-used',
                })

                const expected = {
                    ...mainImage,
                    ...notUsed,
                }
                expect(actual).toStrictEqual(expected)
            })

            it('should be overriden by img src from facia when provided', () => {
                const article: CAPIContent = Article({
                    key: 'my-article',
                    trail: 'article',
                    image: mainImage,
                    trailImage: trailImg,
                })
                const furniture: PublishedFurniture = PublishedFurnitureFixture(
                    {
                        trailTextOverride: '',
                        imageSrcOverride: pubImg,
                    },
                )

                const { trailImage: actual } = getImages(article, furniture, {
                    mobile: 'not-used',
                    tablet: 'not-used',
                })

                const expected = { path: 'pub.img', source: 'test', ...notUsed }
                expect(actual).toStrictEqual(expected)
            })

            it('should fallback to trail image if main image is undefined', () => {
                const article: CAPIContent = Article({
                    key: 'my-article',
                    trail: 'article',
                    image: undefined,
                    trailImage: trailImg,
                })
                const furniture: PublishedFurniture = PublishedFurnitureFixture(
                    {
                        trailTextOverride: '',
                    },
                )

                const { trailImage: actual } = getImages(article, furniture, {
                    mobile: 'not-used',
                    tablet: 'not-used',
                })

                const expected = {
                    ...trailImg,
                    ...notUsed,
                }
                expect(actual).toStrictEqual(expected)
            })
        })

        describe('cover card images', () => {
            it('should be taken from facia when provided', () => {
                const article: CAPIContent = Article({
                    key: 'my-article',
                    trail: 'article',
                    image: mainImage,
                    trailImage: trailImg,
                })
                const furniture: PublishedFurniture = PublishedFurnitureFixture(
                    {
                        trailTextOverride: '',
                        coverCardImages: pubImages,
                    },
                )

                const {
                    // extract the first two so we can ignore them in the comparison
                    image, // eslint-disable-line @typescript-eslint/no-unused-vars
                    trailImage, // eslint-disable-line @typescript-eslint/no-unused-vars
                    ...actualCoverCardImages
                } = getImages(article, furniture, {
                    mobile: 'not-used',
                    tablet: 'not-used',
                })

                const expected = {
                    cardImage: { path: 'pub.img', source: 'test' },
                    cardImageTablet: { path: 'pub.img', source: 'test' },
                }
                expect(actualCoverCardImages).toStrictEqual(expected)
            })
        })
    })
})
