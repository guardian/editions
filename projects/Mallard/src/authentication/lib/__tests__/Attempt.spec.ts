import {
    TErrorAttempt,
    TInvalidAttempt,
    isValid,
    TNotRun,
    TValidAttempt,
} from '../Attempt'

describe('Attempt', () => {
    describe('isValid', () => {
        it('should return true is their attempt is successful', () => {
            const validAttempt = { type: 'valid-attempt' }
            expect(
                isValid(validAttempt as TValidAttempt<{ data: '' }>),
            ).toEqual(true)
        })
        it('should return true while deciding on whether a user is allowed to see content', () => {
            const notRunAttempt = { type: 'not-run-attempt' }
            expect(isValid(notRunAttempt as TNotRun)).toEqual(true)
        })
        it('should return false if there is an error when attempting', () => {
            const errorAttempt = { type: 'error-attempt' }
            expect(isValid(errorAttempt as TErrorAttempt)).toEqual(false)
        })
        it('should return false if the attempt is invalid', () => {
            const invalidAttempt = { type: 'error-attempt' }
            expect(isValid(invalidAttempt as TInvalidAttempt)).toEqual(false)
        })
    })
})
