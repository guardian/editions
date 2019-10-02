import { handleAndNotifyInternal, HandlerDependencies } from './task-handler'

const dontCare = {} as any

describe('handleAndNotifyInternal', () => {
    it('should return result of handler and not call depnedencies when success-status is undefimed', async () => {
        const input = {
            issuePublication: {
                edition: 'daily-edition',
                version: '2019-10-02T11:31:58.974+01:00',
                issueDate: '2019-09-11',
            },
        }

        const handler = async () => 'banana'

        const dependencies = {
            putStatus: jest.fn(),
            sendPublishStatusToTopic: jest.fn(),
        }

        const actual = await handleAndNotifyInternal(
            undefined,
            handler,
            dependencies,
        )(input, dontCare, dontCare)

        expect(actual).toBe('banana')
        expect(dependencies.putStatus).toBeCalledTimes(0)
        expect(dependencies.sendPublishStatusToTopic).toBeCalledTimes(0)
    })
})
