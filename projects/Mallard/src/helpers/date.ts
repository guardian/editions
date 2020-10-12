import moment from 'moment-timezone'
import { languageLocale } from './locale'
import { Platform } from 'react-native'

const londonTime = (time?: string | number) => {
    if (time != null) return moment.tz(time, 'Europe/London')
    return moment.tz('Europe/London')
}

const localDate = (date: Date): string => {
    if (Platform.OS === 'ios') {
        return date.toLocaleDateString(languageLocale)
    } else {
        return languageLocale === "en-US" ? moment(date).format('MM/DD/YYYY') : moment(date).format('DD/MM/YYYY')
    }
}

export { londonTime, localDate }
