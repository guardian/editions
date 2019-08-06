import {
    runAuthChain,
    IdentityAuthStatus,
    CASAuthStatus,
    isAuthed,
} from '../credentials-chain'
import { userData, casExpiry } from './fixtures'

describe('credentials-chain', () => {
    describe('runAuthChain', () => {
        it('returns the value of the first truthy Promise in the chain', async () => {
            const res: any = await runAuthChain([
                async () => IdentityAuthStatus(userData).data,
                async () => CASAuthStatus(casExpiry).data,
            ])

            expect(isAuthed(res)).toBe(true)
            expect(res.data.type).toBe('identity')
        })

        it('ignores errors and tries the next provider', async () => {
            const res: any = await runAuthChain([
                async () => {
                    throw new Error()
                },
                async () => CASAuthStatus(casExpiry).data,
            ])

            expect(res.data.type).toBe('cas')
        })

        it('tries the next provider if the current one returns false', async () => {
            const res: any = await runAuthChain([
                async () => false,
                async () => CASAuthStatus(casExpiry).data,
            ])

            expect(res.data.type).toBe('cas')
        })

        it('returns unauthed if no provider returns a truth value', async () => {
            const res: any = await runAuthChain([
                async () => false,
                async () => {
                    throw new Error()
                },
            ])

            expect(isAuthed(res)).not.toBe(true)
        })
    })
})
