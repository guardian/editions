import moment from 'moment-timezone'

const londonTime = (time?: string | number) => {
    if (time != null) return moment.tz(time, 'Europe/London')
    return moment.tz('Europe/London')
}

export { londonTime }
