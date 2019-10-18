import {
    scheduleDeviceNotificationIfEligibleInternal,
    IssueNotificationData,
    ScheduleDeviceNotificationInput,
} from './device-notifications'

const apiCfg = {
    domain: 'http://example.com',
    apiKey: 'some.key',
}

const stub = async (input: ScheduleDeviceNotificationInput) => {
    console.log(JSON.stringify(input))
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

    it('skip request if edition was not daily-edition', async () => {
        const issueWithTrainingEdition = Object.assign(issueFromDailyEdition, {
            edition: 'training-edition',
        })
        const actual = await scheduleDeviceNotificationIfEligibleInternal(
            issueWithTrainingEdition,
            apiCfg,
            dayBeforeIssue,
            testDependencies,
        )
        expect(actual).toBe('skipped')
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
