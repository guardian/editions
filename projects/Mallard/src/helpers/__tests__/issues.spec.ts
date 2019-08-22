import MockDate from 'mockdate'
import { todayAsFolder, lastSevenDays } from '../issues'

describe('helpers/issues', () => {
    describe('todayAsFolder', () => {
        it('should return "today\'s" date in the correct format', () => {
            MockDate.set('2000-11-22')
            expect(todayAsFolder()).toEqual('2000-11-22')
        })
    })

    describe('lastSevenDays', () => {
        it('should give the last seven days, including today in the correct format', () => {
            MockDate.set('2019-08-21')
            expect(lastSevenDays()).toEqual([
                '2019-8-21',
                '2019-8-20',
                '2019-8-19',
                '2019-8-18',
                '2019-8-17',
                '2019-8-16',
                '2019-8-15',
            ])
        })
    })
})
