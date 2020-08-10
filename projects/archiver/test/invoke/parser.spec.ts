import { parseIssueActionRecordInternal } from '../../src/invoke/parser'
import { hasFailed } from '../../common'

describe('parseRecord', () => {
    it('should parse correct json', async () => {

        const objectsContents =
            '{"action":"proof","id":"ff8936b8-cc57-4572-9a50-bd779319f726","name":"american-edition","edition":"american-edition","issueDate":"2019-10-09","version":"2019-10-04T16:08:35.951Z","fronts":[{"id":"cde7a75d-5fdc-4468-aefe-aac676f4090e","name":"National","collections":[{"id":"3e16f025-690f-4ea3-9e58-7aa779b20df4","name":"Front Page","items":[{"internalPageCode":6668324,"furniture":{"showByline":false,"showQuotedHeadline":false,"mediaType":"useArticleTrail","overrideArticleMainMedia":false}}]},{"id":"47539d9a-bd1a-46d6-85d8-d6a69daada2e","name":"UK News","items":[{"internalPageCode":6668444,"furniture":{"showByline":false,"showQuotedHeadline":false,"mediaType":"useArticleTrail","overrideArticleMainMedia":false}},{"internalPageCode":6668479,"furniture":{"showByline":false,"showQuotedHeadline":false,"mediaType":"useArticleTrail","overrideArticleMainMedia":false}}]}],"swatch":"news"}], "notificationUTCOffset":1, "topic": "us"}'

        const actual = parseIssueActionRecordInternal(objectsContents)

        expect(actual).toStrictEqual({
            action: 'proof',
            edition: 'american-edition',
            version: '2019-10-04T16:08:35.951Z',
            issueDate: '2019-10-09',
            notificationUTCOffset: 1,
            topic: 'us',
        })
    })

    it('should parse js smaller json with required fields', async () => {
        const objectsContents =
            '{"action":"proof","edition":"american-edition","issueDate":"2019-10-09","version":"2019-10-04T16:08:35.951Z", "notificationUTCOffset":1, "topic":"us"}'

        const actual = parseIssueActionRecordInternal(objectsContents)

        expect(actual).toStrictEqual({
            action: 'proof',
            edition: 'american-edition',
            version: '2019-10-04T16:08:35.951Z',
            issueDate: '2019-10-09',
            notificationUTCOffset: 1,
            topic: 'us',
        })
    })

    it('should fail if one of the required fields is missing', async () => {
        const invalids = [
            '{"issueDate":"2019-10-09","version":"2019-10-04T16:08:35.951Z"}',
            '{"issueDate":"2019-10-09","edition":"american-edition"}',
            '{"version":"2019-10-04T16:08:35.951Z","edition":"american-edition"}',
            '{"version":"2019-10-04T16:08:35.951Z"}',
            '{"edition":"american-edition"}',
            '{"issueDate":"2019-10-09"}',
        ]

        invalids.forEach(s => {
            expect(hasFailed(parseIssueActionRecordInternal(s))).toBe(true)
        })
    })

    it('should fail if JSON was malformed', async () => {
        const objectsContents = '{"'
        expect(hasFailed(parseIssueActionRecordInternal(objectsContents))).toBe(
            true,
        )
    })
})
