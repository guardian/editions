import { EditionId, editions, RegionalEdition, SpecialEdition } from '../types'

export const regionalEditions: RegionalEdition[] = [
    {
        title: 'UK Daily',
        subTitle: 'Published every day by 12am (GMT)',
        edition: editions.daily as EditionId,
        header: {
            title: 'UK Daily',
            subTitle: 'Daily',
        },
        editionType: 'Regional',
        topic: 'au',
        notificationUTCOffset: 1,
        locale: 'en_GB',
    },
    {
        title: 'Australia Daily',
        subTitle: 'Published every day by 9:30am (AEST)',
        edition: editions.ausWeekly as EditionId,
        header: {
            title: 'Austraila',
            subTitle: 'Weekend',
        },
        editionType: 'Regional',
        topic: 'au',
        notificationUTCOffset: 1,
        locale: 'en_AU',
    },
]

export const specialEditions: SpecialEdition[] = [
    {
        edition: 'special-edition' as EditionId,
        expiry: new Date(98, 1).toISOString(),
        editionType: 'Special',
        notificationUTCOffset: 1,
        topic: 'food',
        title: `Food
Monthly`,
        subTitle: 'Store cupboard special: 20 quick and easy lockdown suppers',
        header: {
            title: 'Food',
            subTitle: 'Monthly',
        },
        buttonImageUri:
            'https://media.guim.co.uk/49cebb0db4a3e4d26d7d190da7be4a2e9bd7534f/0_0_103_158/103.png',
        buttonStyle: {
            backgroundColor: '#FEEEF7',
            expiry: {
                color: '#7D0068',
                font: 'GuardianTextSans-Regular',
                lineHeight: 16,
                size: 15,
            },

            subTitle: {
                color: '#7D0068',
                font: 'GuardianTextSans-Bold',
                lineHeight: 20,
                size: 17,
            },
            title: {
                color: '#121212',
                font: 'GHGuardianHeadline-Regular',
                lineHeight: 34,
                size: 34,
            },
            image: {
                height: 134,
                width: 87,
            },
        },
    },
]

export const editionsListFixture = {
    regionalEditions: regionalEditions,
    specialEditions: specialEditions,
    trainingEditions: [],
}
