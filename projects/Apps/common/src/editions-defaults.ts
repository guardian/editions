import { RegionalEdition, editions } from './index'

export const defaultRegionalEditions: RegionalEdition[] = [
    {
        title: 'The Daily',
        subTitle: `Published from London every morning by 6 am (GMT)`,
        edition: editions.daily,
        header: {
            title: 'The Daily',
        },
    },
    {
        title: 'Australia Weekender',
        subTitle: `Published from Sydney every Saturday by 6 am (AEST)`,
        edition: editions.ausWeekly,
        header: {
            title: 'Australia',
            subTitle: 'Weekend',
        },
    },
    {
        title: 'US Weekender',
        subTitle: `Published from New York every Saturday by 6 am (EST)`,
        edition: editions.usWeekly,
        header: {
            title: 'US',
            subTitle: 'Weekend',
        },
    },
]
