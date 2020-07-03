import { RegionalEdition, editions } from './index'

export const defaultRegionalEditions: RegionalEdition[] = [
    {
        title: 'The Daily',
        subTitle: `Published every morning
by 6am (GMT)`,
        edition: editions.daily,
        header: {
            title: 'The Daily',
        },
    },
    {
        title: 'Australia Weekender',
        subTitle: `Published every Saturday morning 
by 6am (AEST)`,
        edition: editions.ausWeekly,
        header: {
            title: 'Australia',
            subTitle: 'Weekender',
        },
    },
    {
        title: 'US Weekender',
        subTitle: `Published every Saturday morning 
by 6am (EST)`,
        edition: editions.usWeekly,
        header: {
            title: 'US',
            subTitle: 'Weekender',
        },
    },
]
