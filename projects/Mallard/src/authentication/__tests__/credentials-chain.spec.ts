import {
    runAuthChain,
    IdentityAuthStatus,
    CASAuthStatus,
    isAuthed,
} from '../credentials-chain'
import { userData, casExpiry } from './fixtures'

/**
 * This helper ensures an ordering or resolving promises, any promise
 * created with this will resolve before any others created with a higher order
 * It's useful to show that the chain runs in serial rather than in parallel
 *
 *  e.g. the below passes (when using Promise.race)
 *  ```js
 *  const val = await Promise.race([
 *     createOrderPromise(2, IdentityAuthStatus(userData).data),
 *     createOrderPromise(1, CASAuthStatus(casExpiry).data),
 *  ])
 *  expect(val.type).toBe('cas')
 * ```
 */
const createOrderPromise = async <T>(priority: number, val: T): Promise<T> => {
    if (priority <= 1) return Promise.resolve(val)
    return Promise.resolve(createOrderPromise(priority - 1, val))
}

describe('credentials-chain', () => {
    describe('runAuthChain', () => {
        it('runs the chain in serial', async () => {
            const res: any = await runAuthChain([
                () => createOrderPromise(2, IdentityAuthStatus(userData).data),
                () => createOrderPromise(1, CASAuthStatus(casExpiry).data),
            ])

            expect(isAuthed(res)).toBe(true)
            expect(res.data.type).toBe('identity')
        })

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
