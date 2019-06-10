import { Issue } from '../common'

const months = [
    'Jan',
    'Feb',
    'March',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dev',
]

const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]

export const renderIssueDate = (
    dateInt: Issue['date'],
): { date: string; weekday: string } => {
    const date = new Date(dateInt)
    return {
        date:
            date.getDate() +
            ' ' +
            months[date.getMonth()] +
            ' ' +
            date.getFullYear(),
        weekday: days[date.getDay()],
    }
}
