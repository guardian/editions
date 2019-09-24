import { patchArticle, getImages } from '../fronts'
import { Article, PublishedFurniture } from './helpers/fixtures'
import { CAPIContent } from '../capi/articles'
import {
    PublishedFurtniture,
    PublishedImage,
    PublishedCardImage,
} from '../fronts/issue'
import { CreditedImage, Image } from '../../common/src'

describe('fronts', () => {
    describe('patchArticle', () => {
        describe('trail and standfirst', () => {
            it('takes the furniture value for trail if it exists', () => {
                const patched = patchArticle(
                    Article({ key: 'my-article', trail: 'article' }),
                    PublishedFurniture({ trailTextOverride: 'furniture' }),
                )[1]
                expect(patched.trail).toBe('furniture')
                expect(patched.trail).toBe(patched.standfirst)
            })

            it('takes the article value for trail when furniture is falsey', () => {
                const p1 = patchArticle(
                    Article({ key: 'my-article', trail: 'article' }),
                    PublishedFurniture({ trailTextOverride: '' }),
                )[1]
                expect(p1.trail).toBe('article')
                expect(p1.trail).toBe(p1.standfirst)

                const p2 = patchArticle(
                    Article({ key: 'my-article', trail: 'article' }),
                    PublishedFurniture(),
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
                    PublishedFurniture({ trailTextOverride: '' }),
                )[1]
                expect(patched.trail).toBe('here is something important')
                expect(patched.trail).toBe(patched.standfirst)
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
                const furniture: PublishedFurtniture = PublishedFurniture({
                    trailTextOverride: '',
                })

                const { image: actual } = getImages(article, furniture)

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
                const furniture: PublishedFurtniture = PublishedFurniture({
                    trailTextOverride: '',
                    overrideArticleMainMedia: true,
                    imageSrcOverride: pubImg,
                })

                const { image: actual } = getImages(article, furniture)

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
                const furniture: PublishedFurtniture = PublishedFurniture({
                    trailTextOverride: '',
                })

                const { trailImage: actual } = getImages(article, furniture)

                const expected = mainImage
                expect(actual).toStrictEqual(expected)
            })

            it('should be overriden by img src from facia when provided', () => {
                const article: CAPIContent = Article({
                    key: 'my-article',
                    trail: 'article',
                    image: mainImage,
                    trailImage: trailImg,
                })
                const furniture: PublishedFurtniture = PublishedFurniture({
                    trailTextOverride: '',
                    imageSrcOverride: pubImg,
                })

                const { trailImage: actual } = getImages(article, furniture)

                const expected = { path: 'pub.img', source: 'test' }
                expect(actual).toStrictEqual(expected)
            })

            it('should fallback to trail image if main image is undefined', () => {
                const article: CAPIContent = Article({
                    key: 'my-article',
                    trail: 'article',
                    image: undefined,
                    trailImage: trailImg,
                })
                const furniture: PublishedFurtniture = PublishedFurniture({
                    trailTextOverride: '',
                })

                const { trailImage: actual } = getImages(article, furniture)

                const expected = trailImg
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
                const furniture: PublishedFurtniture = PublishedFurniture({
                    trailTextOverride: '',
                    coverCardImages: pubImages,
                })

                const {
                    image,
                    trailImage,
                    ...actualCoverCardImages
                } = getImages(article, furniture)

                const expected = {
                    cardImage: { path: 'pub.img', source: 'test' },
                    cardImageTablet: { path: 'pub.img', source: 'test' },
                }
                expect(actualCoverCardImages).toStrictEqual(expected)
            })
        })
    })
})
