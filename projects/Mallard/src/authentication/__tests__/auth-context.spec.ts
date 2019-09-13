import { needsReauth, createAuthAttempt, createRunAuth } from '../auth-context'
import { casExpiry, withCreds } from './fixtures'
import {
    CASAuthStatus,
    unauthed,
    IdentityAuthStatus,
    AuthStatus,
    IdentityAuth,
} from '../credentials-chain'

describe('auth-context', () => {
    describe('needsReauth', () => {
        it('returns false when the previous attempt was `authed` and the attempt was created more recently than a day ago', () => {
            const res = needsReauth(
                createAuthAttempt(CASAuthStatus(casExpiry()), 'live'),
                { isConnected: true },
            )

            expect(res).toBe(false)
        })

        it('returns true when the previous attempt was `authed` and the attempt was created longer than a day ago', () => {
            const res = needsReauth(
                createAuthAttempt(CASAuthStatus(casExpiry()), 'live', 0),
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
                createAuthAttempt(CASAuthStatus(casExpiry()), 'cached'),
                { isConnected: true },
            )

            expect(res).toBe(true)
        })

        it('returns false when the previous attempt was `cached` and `isConnected` is false', () => {
            const res = needsReauth(
                createAuthAttempt(CASAuthStatus(casExpiry()), 'cached'),
                { isConnected: false },
            )

            expect(res).toBe(false)
        })

        it('returns false when the previous attempt was `live` and `isConnected` changes', () => {
            const res1 = needsReauth(
                createAuthAttempt(CASAuthStatus(casExpiry()), 'live'),
                { isConnected: true },
            )

            expect(res1).toBe(false)

            const res2 = needsReauth(
                createAuthAttempt(CASAuthStatus(casExpiry()), 'live'),
                { isConnected: false },
            )

            expect(res2).toBe(false)
        })
    })

    describe('createRunAuth', () => {
        const buildMocks = ({
            isAuthing = false,
            context = 'live',
            idAuth = unauthed,
            otherAuth = unauthed,
        }: {
            isAuthing?: boolean
            context?: 'live' | 'cached'
            idAuth?: AuthStatus<IdentityAuth>
            otherAuth?: AuthStatus
        } = {}) => {
            const setIsAuthing = jest.fn()
            const setIdentityStatus = jest.fn()
            const updateAuth = jest.fn()

            const runAuth = createRunAuth(
                isAuthing,
                setIsAuthing,
                setIdentityStatus,
                updateAuth,
            )

            const idChain = jest.fn(() => Promise.resolve(idAuth))
            const otherChain = jest.fn(() => Promise.resolve(otherAuth))
            const promise = runAuth(context, idChain, otherChain)

            return {
                setIsAuthing,
                setIdentityStatus,
                updateAuth,
                idChain,
                otherChain,
                promise,
            }
        }

        const idAuthStatus = ({ valid }: { valid: boolean }) =>
            IdentityAuthStatus(
                withCreds({
                    email: 'r@b.com',
                    digitalPack: valid,
                }),
            )

        const casAuthStatus = CASAuthStatus(casExpiry())

        it('only runs when isAuthing is false', async () => {
            const { setIsAuthing, promise } = buildMocks({ isAuthing: true })
            await promise
            expect(setIsAuthing).not.toBeCalled()
        })

        it('runs identity auth as a priority and does not run other chain if succesful', async () => {
            const idAuth = idAuthStatus({ valid: true })
            const { promise, idChain, otherChain, updateAuth } = buildMocks({
                idAuth,
            })

            await promise

            expect(idChain).toHaveBeenCalledTimes(1)
            expect(otherChain).not.toHaveBeenCalled()
            expect(updateAuth).toBeCalledTimes(1)
            expect(updateAuth).toBeCalledWith(idAuth, 'live')
        })

        it('sets identity when identity auth is successful', async () => {
            const idAuth = idAuthStatus({ valid: true })
            const { promise, setIdentityStatus } = buildMocks({
                idAuth,
            })

            await promise

            expect(setIdentityStatus).toBeCalledTimes(1)
            expect(setIdentityStatus).toBeCalledWith(idAuth)
        })

        it('runs other chain if identity is invalid', async () => {
            const idAuth = idAuthStatus({ valid: false })
            const { promise, setIdentityStatus } = buildMocks({
                idAuth,
                otherAuth: casAuthStatus,
            })

            await promise

            expect(setIdentityStatus).toBeCalledTimes(1)
            expect(setIdentityStatus).toBeCalledWith(idAuth)
        })

        it('sets identity even when identity auth is unsuccessful', async () => {
            const idAuth = idAuthStatus({ valid: false })
            const { promise, setIdentityStatus } = buildMocks({
                idAuth,
                otherAuth: casAuthStatus,
            })

            await promise

            expect(setIdentityStatus).toBeCalledTimes(1)
            expect(setIdentityStatus).toBeCalledWith(idAuth)
        })

        it('sets sets isAuthing to false after id auth', async () => {
            const { promise, setIsAuthing } = buildMocks({
                idAuth: idAuthStatus({ valid: true }),
            })

            expect(setIsAuthing).toBeCalledTimes(1)
            expect(setIsAuthing).toBeCalledWith(true)

            await promise

            expect(setIsAuthing).toBeCalledTimes(2)
            expect(setIsAuthing).toBeCalledWith(false)
        })

        it('sets sets isAuthing to false after other auth', async () => {
            const { promise, setIsAuthing } = buildMocks({
                otherAuth: casAuthStatus,
            })

            expect(setIsAuthing).toBeCalledTimes(1)
            expect(setIsAuthing).toBeCalledWith(true)

            await promise

            expect(setIsAuthing).toBeCalledTimes(2)
            expect(setIsAuthing).toBeCalledWith(false)
        })
    })
})
