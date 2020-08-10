import {
    scheduleDeviceNotificationIfEligibleInternal,
    IssueNotificationData,
    ScheduleDeviceNotificationInput,
} from '../../../../src/tasks/notification/helpers/device-notifications'

const apiCfg = {
    domain: 'http://example.com',
    apiKey: 'some.key',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stub = async (input: ScheduleDeviceNotificationInput) => {
    return { statusCode: 200, statusText: 'success' }
}

const testDependencies = {
    scheduleNotificationFunction: stub,
}

describe('scheduleDeviceNotificationIfEligibleInternal', () => {
    const issueFromDailyEdition: IssueNotificationData = {
        key: 'daily-edition/2019-09-18',
        name: 'Daily Edition',
        edition: 'daily-edition',
        issueDate: '2019-09-18',
        notificationUTCOffset: 1,
        topic: 'uk',
    }

    const dayBeforeIssue = new Date('2019-09-17')

    const dayAfterIssue = new Date('2019-09-19')

    it('send request if schedule time was in future and edition is daily-edition', async () => {
        const actual = await scheduleDeviceNotificationIfEligibleInternal(
            issueFromDailyEdition,
            apiCfg,
            dayBeforeIssue,
            testDependencies,
        )
        expect(actual).toBe('scheduled')
    })

    it('do not skip request if edition was not daily-edition', async () => {
        const issueWithTrainingEdition = Object.assign(issueFromDailyEdition, {
            edition: 'training-edition',
        })
        const actual = await scheduleDeviceNotificationIfEligibleInternal(
            issueWithTrainingEdition,
            apiCfg,
            dayBeforeIssue,
            testDependencies,
        )
        expect(actual).not.toBe('skipped')
    })

    it('skip request if edition was daily-edition but in the past', async () => {
        const actual = await scheduleDeviceNotificationIfEligibleInternal(
            issueFromDailyEdition,
            apiCfg,
            dayAfterIssue,
            testDependencies,
        )
        expect(actual).toBe('skipped')
    })
})
