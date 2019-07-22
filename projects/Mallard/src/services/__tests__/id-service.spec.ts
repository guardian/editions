import 'isomorphic-fetch'
import { fetchAuth } from '../id-service'
import fetchMock from 'fetch-mock'

describe('idService', () => {
    describe('fetchAuth', () => {
        beforeEach(fetchMock.resetBehavior)

        it('creates a form-encoded string from the params in the body', async () => {
            const url = 'http://test.com'

            fetchMock.post(`begin:${url}/auth`, {
                accessToken: {
                    accessToken: 'token',
                },
            })

            await fetchAuth({ aParam: 'some-value' }, url)

            const { body } = fetchMock.calls()[0][1] || { body: null }

            expect(body).toBe('aParam=some-value')
        })

        it('returns the access token from the response', async () => {
            const url = 'http://test.com'

            fetchMock.post(`begin:${url}/auth`, {
                accessToken: {
                    accessToken: 'token',
                },
            })

            const res = await fetchAuth({}, url)

            expect(res).toBe('token')
        })

        it('throws an error on non-200 responses', async () => {
            const url = 'http://test.com'

            fetchMock.post(`begin:${url}/auth`, {
                body: JSON.stringify({
                    errors: [
                        {
                            message: 'error-message',
                            description: 'error-description',
                        },
                    ],
                }),
                status: 419,
            })

            let error

            try {
                await fetchAuth({}, url)
            } catch (e) {
                error = e
            }

            expect(error).toBeInstanceOf(Error)
            expect(error.message).toEqual(
                expect.stringContaining('error-message'),
            )
            expect(error.message).toEqual(
                expect.stringContaining('error-description'),
            )
        })
    })
})
