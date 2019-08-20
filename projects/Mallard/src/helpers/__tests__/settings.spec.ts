import { withConsent } from '../settings'

describe('settings', () => {
    describe('withConsent', () => {
        it('runs deny when the relevant setting is not there', async () => {
            expect(
                await withConsent(
                    'gdprAllowFunctionality',
                    {
                        allow: () => true,
                        deny: () => false,
                    },
                    () => Promise.resolve(null),
                ),
            ).toBe(false)
        })

        it('runs deny when the relevant setting is false', async () => {
            expect(
                await withConsent(
                    'gdprAllowFunctionality',
                    {
                        allow: () => true,
                        deny: () => false,
                    },
                    () => Promise.resolve(false),
                ),
            ).toBe(false)
        })

        it('runs allow when the relevant setting is true', async () => {
            expect(
                await withConsent(
                    'gdprAllowFunctionality',
                    {
                        allow: () => true,
                        deny: () => false,
                    },
                    () => Promise.resolve(true),
                ),
            ).toBe(true)
        })

        it('runs allow when the switch name is set to false', async () => {
            expect(
                await withConsent(
                    null,
                    {
                        allow: () => true,
                        deny: () => false,
                    },
                    () => Promise.resolve(false),
                ),
            ).toBe(true)
        })
    })
})
