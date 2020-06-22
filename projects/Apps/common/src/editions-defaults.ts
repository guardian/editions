import { RegionalEdition, editions } from './index'

export const defaultRegionalEditions: RegionalEdition[] = [
    {
        title: 'The Daily',
        subTitle: 'Published every day by 6am (GMT)',
        edition: editions.daily,
    },
    {
        title: 'Australia Weekend',
        subTitle: 'Published every Saturday by 6am (AEST)',
        edition: editions.ausWeekly,
    },
    {
        title: 'US Weekend',
        subTitle: 'Published every Saturday by 6am (EST)',
        edition: editions.usWeekly,
    },
]
