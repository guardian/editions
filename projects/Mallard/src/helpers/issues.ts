import { Issue } from 'src/common'
import { useMemo } from 'react'

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

interface IssueDate {
    date: string
    weekday: string
}

export const renderIssueDate = (dateString: Issue['date']): IssueDate => {
    const date = new Date(dateString)
    return {
        date: date.getDate() + ' ' + months[date.getMonth()],
        weekday: days[date.getDay()],
    }
}

export const useIssueDate = (issue?: Issue): IssueDate =>
    useMemo(
        () => (issue ? renderIssueDate(issue.date) : { date: '', weekday: '' }),
        [issue && issue.key, issue],
    )
