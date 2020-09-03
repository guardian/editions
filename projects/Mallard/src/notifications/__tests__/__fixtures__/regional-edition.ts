import { RegionalEdition, editions } from 'src/common'

export const regionalEdition: RegionalEdition = {
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
}
