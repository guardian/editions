import MockDate from 'mockdate'
import { issuesToDelete } from 'src/helpers/files'

describe('clear issues', () => {
    describe('issuesToDelete', () => {
        MockDate.set('2019-08-21')
        it('should return items outside of the 7 days that dont follow the issue naming, or the issue index', async () => {
            const files = [
                'daily-edition/issues',
                'some-random-file',
                'daily-edition/2019-08-15',
                'daily-edition/2019-08-14',
            ]
            expect(await issuesToDelete(files)).toEqual([
                'some-random-file',
                'daily-edition/2019-08-14',
            ])
        })

        it("should return an empty array if there isn't any to delete", async () => {
            const files = [
                'daily-edition/2019-08-15',
                'daily-edition/2019-08-16',
            ]
            expect(await issuesToDelete(files)).toEqual([])
        })
    })
})