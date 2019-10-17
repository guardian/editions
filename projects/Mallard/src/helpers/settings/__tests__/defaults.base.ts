import { notificationTrackingUrl } from '../defaults'

const notificationId = '1234567890qwertyuio'

export const baseTests = ({
    receiveExpect,
    completeExpect,
    platform,
    env,
}: {
    receiveExpect: string
    completeExpect: string
    platform: 'iOS' | 'Android'
    env: 'CODE' | 'PROD'
}) =>
    describe(`${env} endpoint - ${platform}`, () => {
        beforeEach(() => {
            // @ts-ignore: Cannot overide constant __DEV__ but need to for the test
            __DEV__ = env === 'CODE' ? true : false
        })
        it('should provide a receive endpoint', () => {
            expect(notificationTrackingUrl(notificationId, 'received')).toEqual(
                receiveExpect,
            )
        })
        it('should provide a complete endpoint', () => {
            expect(notificationTrackingUrl(notificationId, 'complete')).toEqual(
                completeExpect,
            )
        })
    })
