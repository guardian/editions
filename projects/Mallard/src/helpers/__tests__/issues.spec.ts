import MockDate from 'mockdate'
import { todayAsFolder } from '../issues'

describe('todayAsFolder', () => {
    beforeEach(() => {
        MockDate.set('2000-11-22')
    })

    it('should return "today\'s" date in the correct format', () => {
        expect(todayAsFolder()).toEqual('2000-11-22')
    })
})
