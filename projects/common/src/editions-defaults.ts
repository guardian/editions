import { RegionalEdition, editions } from './types'

export const defaultRegionalEditions: RegionalEdition[] = [
    {
        title: 'UK Daily',
        subTitle: `Published from London every 
morning by 6am (GMT)`,
        edition: editions.daily,
        header: {
            title: 'UK',
            subTitle: 'Daily',
        },
        editionType: 'Regional',
        topic: 'uk',
        notificationUTCOffset: 3,
        locale: 'en_GB',
    },
]
