import {
    createScheduleTime,
    shouldSchedule,
    prepareScheduleDeviceNotificationRequest,
} from '../device-notifications-helpers'
import { IssueNotificationData } from '../device-notifications'
import { RequestInit, RequestInfo } from 'node-fetch'

describe('prepareScheduleDeviceNotificationRequest', () => {
    it('should prepare request Body and request endpoint correctly for [Daily Edition]', () => {
        const issueData: IssueNotificationData = {
            key: 'daily-edition/2019-09-18',
            name: 'Daily Edition',
            edition: 'daily-edition',
            issueDate: '2019-09-18',
        }

        const apiCfg = {
            domain: 'http://example.com',
            apiKey: 'some.key',
        }
        const scheduleTime = '2019-09-18T03:00:00Z'

        const actual = prepareScheduleDeviceNotificationRequest(
            issueData,
            apiCfg,
            scheduleTime,
        )

        const expected: { reqEndpoint: RequestInfo; reqBody: RequestInit } = {
            reqEndpoint:
                'http://example.com/push/schedule/2019-09-18T03:00:00Z',
            reqBody: {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer some.key',
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body:
                    '{"id":"a8b07133-19c1-5a00-a42b-f55bee6508c7","type":"editions","topic":[{"type":"editions","name":"uk"}],"key":"daily-edition/2019-09-18","name":"Daily Edition","date":"2019-09-18","sender":"editions-backend"}',
            },
        }

        expect(actual).toStrictEqual(expected)
    })
})
describe('createScheduleTime', () => {
    it('should create schedule tiem from issue at 3 am', () => {
        expect(createScheduleTime('2019-09-30')).toBe('2019-09-30T03:00:00Z')
    })
})

describe('shouldSchedule', () => {
    it('should schedule when current time is before schedule time', () => {
        expect(
            shouldSchedule(
                '2019-09-30T03:00:00Z',
                new Date('2019-09-29T15:00:00Z'),
            ),
        ).toBe(true)
    })
    it('should not schedule when current time is after schedule time', () => {
        expect(
            shouldSchedule(
                '2019-09-30T03:00:00Z',
                new Date('2019-09-30T04:00:00Z'),
            ),
        ).toBe(false)
    })
    it('should explode on invalid now Date', () => {
        expect(() =>
            shouldSchedule('2019-09-30T03:00:00Z', new Date('bannana')),
        ).toThrowError()
    })
    it('should explode on invalid scheduleTime Date', () => {
        expect(() =>
            shouldSchedule('bannana', new Date('2019-09-30T04:00:00Z')),
        ).toThrowError()
    })
})
