import { patchArticle, getImages } from '../fronts'
import { Article, PublishedFurniture } from './helpers/fixtures'
import { CAPIContent } from '../capi/articles'
import { PublishedFurtniture, PublishedImage, PublishedCardImage } from '../fronts/issue'


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
        const mainImage = {
            credit: undefined,
            path: "master/asset.com",
            source: "test"
        }

        const trailImg = {
            path: "trail/asset.com",
            source: "test"
        }

        it('should extract main image', () => {
            const article: CAPIContent = Article({ key: 'my-article', trail: 'article', image: mainImage, trailImage: trailImg })
            const furniture: PublishedFurtniture = PublishedFurniture({ trailTextOverride: '' })

            const actual = getImages(article, furniture)

            const expected = { image: mainImage, cardImage: undefined, cardImageTablet: undefined }
            expect(actual).toStrictEqual(expected)
        })
    })
})
