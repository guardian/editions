import { Issue } from 'src/common'

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
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]

export const renderIssueDate = (
    dateString: Issue['date'],
): { date: string; weekday: string } => {
    const date = new Date(dateString)
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
