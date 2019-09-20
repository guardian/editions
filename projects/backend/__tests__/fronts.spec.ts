import { patchArticle } from '../fronts'
import { Article, PublishedFurniture } from './helpers/fixtures'

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

    describe('getImages', () => {
        it('')
    })
})
