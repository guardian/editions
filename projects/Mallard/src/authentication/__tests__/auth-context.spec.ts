import { needsReauth, createAuthAttempt } from '../auth-context'
import { casExpiry } from './fixtures'
import { CASAuthStatus, unauthed } from '../credentials-chain'

describe('auth-context', () => {
    describe('needsReauth', () => {
        it('returns false when the previous attempt was `authed` and the attempt was created more recently than a day ago', () => {
            const res = needsReauth(
                createAuthAttempt(CASAuthStatus(casExpiry), 'live'),
                { isConnected: true },
            )

            expect(res).toBe(false)
        })

        it('returns true when the previous attempt was `authed` and the attempt was created longer than a day ago', () => {
            const res = needsReauth(
                createAuthAttempt(CASAuthStatus(casExpiry), 'live', 0),
                { isConnected: true },
            )

            expect(res).toBe(true)
        })

        it('always returns false if the previous attempt was live and unauthed', () => {
            const res = needsReauth(createAuthAttempt(unauthed, 'live', 0), {
                isConnected: true,
            })

            expect(res).toBe(false)
        })

        it('returns true when the previous attempt was `cached` and `isConnected` is true', () => {
            const res = needsReauth(
                createAuthAttempt(CASAuthStatus(casExpiry), 'cached'),
                { isConnected: true },
            )

            expect(res).toBe(true)
        })

        it('returns false when the previous attempt was `cached` and `isConnected` is false', () => {
            const res = needsReauth(
                createAuthAttempt(CASAuthStatus(casExpiry), 'cached'),
                { isConnected: false },
            )

            expect(res).toBe(false)
        })

        it('returns false when the previous attempt was `live` and `isConnected` changes', () => {
            const res1 = needsReauth(
                createAuthAttempt(CASAuthStatus(casExpiry), 'live'),
                { isConnected: true },
            )

            expect(res1).toBe(false)

            const res2 = needsReauth(
                createAuthAttempt(CASAuthStatus(casExpiry), 'live'),
                { isConnected: false },
            )

            expect(res2).toBe(false)
        })
    })
})
