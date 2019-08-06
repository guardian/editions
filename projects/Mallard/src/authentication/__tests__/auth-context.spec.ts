import { needsReauth, createAuthAttempt } from '../auth-context'
import { casExpiry } from './fixtures'
import { CASAuthStatus, unauthed } from '../credentials-chain'

describe('auth-context', () => {
    describe('needsReauth', () => {
        it('returns false when the previous attempt was `authed` and the attempt was created more recently than a day ago', () => {
            const res = needsReauth(
                createAuthAttempt(CASAuthStatus(casExpiry), 'live'),
                true,
            )

            expect(res).toBe(false)
        })

        it('returns true when the previous attempt was `authed` and the attempt was created longer than a day ago', () => {
            const res = needsReauth(
                createAuthAttempt(CASAuthStatus(casExpiry), 'live', 0),
                true,
            )

            expect(res).toBe(true)
        })

        it('always returns false if the previous attempt was live and unauthed', () => {
            const res = needsReauth(
                createAuthAttempt(unauthed, 'live', 0),
                true,
            )

            expect(res).toBe(false)
        })

        it('returns true when the previous attempt was `cached` and `isInternetReachable` is true', () => {
            const res = needsReauth(
                createAuthAttempt(CASAuthStatus(casExpiry), 'cached'),
                true,
            )

            expect(res).toBe(true)
        })
    })
})
