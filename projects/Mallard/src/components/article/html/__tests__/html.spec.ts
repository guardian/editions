import { renderCaption } from '../render'

describe('html', () => {
    describe('renderCaption', () => {
        it('renders just the caption when the credit is undefined', () => {
            expect(
                renderCaption({
                    caption: 'caption',
                    id: 'image',
                    src: { source: 'source', path: 'path' },
                }),
            ).toBe('caption')
        })

        it('renders just the credit when the caption is undefined', () => {
            expect(
                renderCaption({
                    credit: 'credit',
                    id: 'image',
                    src: { source: 'source', path: 'path' },
                }),
            ).toBe('credit')
        })

        it('renders both the caption and credit in that order when both are defined', () => {
            expect(
                renderCaption({
                    caption: 'caption',
                    credit: 'credit',
                    id: 'image',
                    src: { source: 'source', path: 'path' },
                }),
            ).toBe('caption credit')
        })
    })
})
