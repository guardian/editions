import { Issue } from 'src/common'
import { useMemo } from 'react'
import { defaultSettings } from 'src/helpers/settings/defaults'

const months = [
    'Jan',
    'Feb',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
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

const dateToFolderConvert = (date: Date): string => {
    const pad = (n: number) => (n < 10 ? '0' + n : n)
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
        date.getUTCDate(),
    )}`
}

export const todayAsFolder = (): string => dateToFolderConvert(new Date())

export const todayAsKey = (): string =>
    `${defaultSettings.contentPrefix}/${todayAsFolder()}`

export const lastSevenDays = (): string[] => {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return dateToFolderConvert(d)
    })
}
