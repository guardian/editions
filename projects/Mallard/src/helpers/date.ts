import moment from 'moment-timezone'

const londonTime = (time?: moment.MomentInput) =>
    moment(time).tz('Europe/London')

export { londonTime }
