import { internalHandler, Record, InvokerDependencies } from '.'
import { GetS3ObjParams } from '../utils/s3'
import {
    withFailureMessage,
    failure,
    IssuePublicationIdentifier,
} from '../../common'

describe('state machine invoker', () => {
    const obejctsContentsInput =
        '{"id":"ff8936b8-cc57-4572-9a50-bd779319f726","name":"american-edition","edition":"american-edition","issueDate":"2019-10-09","version":"2019-10-04T16:08:35.951Z","fronts":[{"id":"cde7a75d-5fdc-4468-aefe-aac676f4090e","name":"National","collections":[{"id":"3e16f025-690f-4ea3-9e58-7aa779b20df4","name":"Front Page","items":[{"internalPageCode":6668324,"furniture":{"showByline":false,"showQuotedHeadline":false,"mediaType":"useArticleTrail","overrideArticleMainMedia":false}}]},{"id":"47539d9a-bd1a-46d6-85d8-d6a69daada2e","name":"UK News","items":[{"internalPageCode":6668444,"furniture":{"showByline":false,"showQuotedHeadline":false,"mediaType":"useArticleTrail","overrideArticleMainMedia":false}},{"internalPageCode":6668479,"furniture":{"showByline":false,"showQuotedHeadline":false,"mediaType":"useArticleTrail","overrideArticleMainMedia":false}}]}],"swatch":"news"}]}'

    const recordsInput: Record[] = [
        {
            s3: {
                bucket: {
                    name: 'test-bucket',
                },
                object: {
                    key: 'some/key/123.json',
                },
            },
            eventTime: '2019-10-10',
        },
    ]

    it('should handle (new records arrived) event when state machine invocation succeed', async () => {
        const invokeStateMachineAllwaysSuccess = async (
            issuePublication: IssuePublicationIdentifier,
        ) => {
            return issuePublication
        }

        const testDependencies: InvokerDependencies = {
            stateMachineInvoke: invokeStateMachineAllwaysSuccess,
            s3fetch: (params: GetS3ObjParams) => {
                return Promise.resolve(obejctsContentsInput)
            },
        }

        const actual = await internalHandler(recordsInput, testDependencies)

        const issueExpected = {
            edition: 'american-edition',
            version: '2019-10-04T16:08:35.951Z',
            issueDate: '2019-10-09',
        }
        const expecetd = [
            `✅ Invocation of ${JSON.stringify(issueExpected)} succeeded.`,
        ]

        expect(actual).toStrictEqual(expecetd)
    })

    it('should thorw error when no state machine invocation were made', async () => {
        const invokeStateMachineAllwaysFails = async (
            issuePublication: IssuePublicationIdentifier,
        ) => {
            return withFailureMessage(
                failure({ error: 'banana' }),
                `⚠️ Invocation of ${JSON.stringify(issuePublication)} failed.`,
            )
        }

        const testDependencies: InvokerDependencies = {
            stateMachineInvoke: invokeStateMachineAllwaysFails,
            s3fetch: (params: GetS3ObjParams) => {
                return Promise.resolve(obejctsContentsInput)
            },
        }

        await expect(
            internalHandler(recordsInput, testDependencies),
        ).rejects.toStrictEqual(new Error('No invocations were made.'))
    })
})
