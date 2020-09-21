import { editionDirsToClean } from '../clear-issues'

describe('clear-issues', () => {
    describe('editionDirsToClean', () => {
        it('should never return default editions', () => {
            const toClean = editionDirsToClean(
                [
                    { name: 'daily-edition', path: '' },
                    { name: 'test-edition', path: '' },
                ],
                [],
            )
            expect(toClean).toEqual([{ name: 'test-edition', path: '' }])
        })

        it('should never return the download folder', () => {
            const toClean = editionDirsToClean(
                [
                    { name: 'test-edition', path: '' },
                    { name: 'download', path: '' },
                ],
                [],
            )
            expect(toClean).toEqual([{ name: 'test-edition', path: '' }])
        })

        it('should never return hidden folders', () => {
            const toClean = editionDirsToClean(
                [
                    { name: 'test-edition', path: '' },
                    { name: '.DS_STORE', path: '' },
                    { name: '.hidden', path: '' },
                ],
                [],
            )
            expect(toClean).toEqual([{ name: 'test-edition', path: '' }])
        })

        it('should never return current editions', () => {
            const toClean = editionDirsToClean(
                [
                    { name: 'test-edition', path: '' },
                    { name: 'important-edition', path: '' },
                ],
                ['important-edition'],
            )
            expect(toClean).toEqual([{ name: 'test-edition', path: '' }])
        })
    })
})
