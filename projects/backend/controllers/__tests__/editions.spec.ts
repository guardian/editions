import { validateEditionsList } from '../editions'

describe('validateEditionsList', () => {
    it('returns true when an valid list is passed', () => {
        const validList = {
            regionalEditions: [
                {
                    title: 'UK Daily',
                    subTitle:
                        'Published from London every morning by 6am (GMT)',
                    edition: 'daily-edition',
                    header: { title: 'UK Daily' },
                    editionType: 'Regional',
                    notificationUTCOffset: 3,
                    topic: 'uk',
                },
                {
                    title: 'US Weekend',
                    subTitle:
                        'Published from New York every Saturday morning by 6am (EST)',
                    edition: 'american-edition',
                    header: { title: 'US', subTitle: 'Weekend' },
                    editionType: 'Regional',
                    notificationUTCOffset: 8,
                    topic: 'us',
                },
                {
                    title: 'Australia Weekend',
                    subTitle:
                        'Published from Sydney every Saturday by 6 am (AEST)',
                    edition: 'australian-edition',
                    header: { title: 'Australia', subTitle: 'Weekend' },
                    editionType: 'Regional',
                    notificationUTCOffset: -5,
                    topic: 'au',
                },
            ],
        }
        expect(validateEditionsList(validList)).toBeTruthy()
    })

    it('returns false when an invalid list is passed', () => {
        const invalidList = {
            regionalEditions: [
                {
                    edition: 'daily-edition',
                },
            ],
        }

        expect(validateEditionsList(invalidList)).toBeFalsy()

        const invalidList2 = {
            regionalEditions: [
                {
                    tootle: 'UK Daily',
                    subTitle:
                        'Published from London every morning by 6am (GMT)',
                    edition: 'daily-edition',
                    header: { title: 'UK Daily' },
                    editionType: 'Regional',
                    notificationUTCOffset: 3,
                    topic: 'uk',
                },
                {
                    tootle: 'US Weekend',
                    subTitle:
                        'Published from New York every Saturday morning by 6am (EST)',
                    edition: 'american-edition',
                    header: { title: 'US', subTitle: 'Weekend' },
                    editionType: 'Regional',
                    notificationUTCOffset: 8,
                    topic: 'us',
                },
                {
                    tootle: 'Australia Weekend',
                    subTitle:
                        'Published from Sydney every Saturday by 6 am (AEST)',
                    edition: 'australian-edition',
                    header: { title: 'Australia', subTitle: 'Weekend' },
                    editionType: 'Regional',
                    notificationUTCOffset: -5,
                    topic: 'au',
                },
            ],
            specialEditions: [],
            trainingEditions: [],
        }
        expect(validateEditionsList(invalidList2)).toBeFalsy()
    })
})
