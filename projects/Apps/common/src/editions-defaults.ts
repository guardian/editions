import { RegionalEdition, editions } from './index'

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
    {
        title: 'Australia Weekend',
        subTitle: `Published from Sydney every 
Saturday by 6 am (AEST)`,
        edition: editions.ausWeekly,
        header: {
            title: 'Australia',
            subTitle: 'Weekend',
        },
        editionType: 'Regional',
        topic: 'au',
        notificationUTCOffset: -5,
        locale: 'en_AU',
    },
]
