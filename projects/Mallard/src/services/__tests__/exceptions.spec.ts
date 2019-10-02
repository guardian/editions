import { withTimeout, Timeout, handleFetchError, Error5XX } from '../exceptions'

describe('exceptions', () => {
    describe('withTimeout', () => {
        it("throws a Timeout error if a promise doesn't resolve in the specified time", () => {
            expect(withTimeout(new Promise(() => {}), 1)).rejects.toThrow(
                Timeout,
            )
        })

        it('resolves with the promise result if a promise does resolve in the specified time', () => {
            expect(withTimeout(Promise.resolve('thing'), 1)).resolves.toBe(
                'thing',
            )
        })
    })

    describe('handleFetchError', () => {
        it('when an error is a Timeout it resolves with the value of the called continuation', () => {
            expect(
                withTimeout(new Promise(() => {}), 1).catch(
                    handleFetchError({ error: () => 3 }),
                ),
            ).resolves.toBe(3)
        })

        it('when an error is a Error5XX it resolves with the value of the called continuation', () => {
            expect(
                withTimeout(
                    new Promise(() => {
                        throw new Error5XX()
                    }),
                    1,
                ).catch(handleFetchError({ error: () => 4 })),
            ).resolves.toBe(4)
        })

        it('handles async continuations', () => {
            expect(
                withTimeout(
                    new Promise(() => {
                        throw new Error5XX()
                    }),
                    1,
                ).catch(handleFetchError({ error: async () => 4 })),
            ).resolves.toBe(4)
        })

        it('ignores any other errors', () => {
            class MyError extends Error {}
            expect(
                withTimeout(
                    new Promise(() => {
                        throw new MyError()
                    }),
                    1,
                ).catch(handleFetchError({ error: () => 4 })),
            ).rejects.toThrow(MyError)
        })
    })
})
