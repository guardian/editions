import { Request, Response } from 'express'

import { s3fetch, s3Latest, s3List } from '../s3'
import { Issue, notNull, IssueSummary } from '../common'
import { lastModified, LastModifiedUpdater } from '../lastModified'
import { IssueResponse } from '../fronts/issue'
import { hasFailed, Attempt } from '../utils/try'

const getIssue = async (
    issue: string,
    lastModifiedUpdater: LastModifiedUpdater,
): Promise<Issue | 'notfound'> => {
    console.log('Attempting to get latest issue for', issue)
    const latest = await s3Latest(`daily-edition/${issue}/`)
    if (hasFailed(latest)) {
        console.error(`Could not get latest issue.`)
        console.error(JSON.stringify(latest))
        return 'notfound'
    }
    const { key } = latest
    console.log(`Fetching ${key} for ${issue}`)

    const x = await s3fetch(key)

    if (hasFailed(x)) {
        return 'notfound'
    }

    lastModifiedUpdater(x.lastModified)
    const data = (await x.json()) as IssueResponse
    const fronts = data.fronts.map(_ => _.name)
    return {
        name: data.name,
        key: issue,
        id: data.id,
        date: data.issueDate,
        fronts,
    }
}

export const issueController = (req: Request, res: Response) => {
    const id: string = req.params.issueId
    const [date, updater] = lastModified()
    console.log(`${req.url}: request for issue ${id}`)
    getIssue(id, updater)
        .then(data => {
            if (data === 'notfound') {
                res.sendStatus(404)
                return
            }
            res.setHeader('Last-Modifed', date())
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(data))
        })
        .catch(e => console.error(e))
}

const getIssuesSummary = async (): Promise<Attempt<IssueSummary[]>> => {
    const issueKeys = await s3List('daily-edition/')
    if (hasFailed(issueKeys)) {
        console.error('Error in issue index controller')
        console.error(JSON.stringify(issueKeys))
        return issueKeys
    }
    const issueDates = issueKeys.map(_ => _.split('/')).map(([, date]) => date)
    return issueDates
        .map(key => {
            const date = new Date(key)
            if (isNaN(date.getTime())) {
                console.warn(`Issue with path ${key} is not a valid date`)
                return null
            }
            return {
                key,
                name: 'Daily Edition',
                date: date.toISOString(),
            }
        })
        .filter(notNull)
}

export const issuesSummaryController = (req: Request, res: Response) => {
    console.log('Issue summary requested.')
    getIssuesSummary()
        .then(data => {
            if (hasFailed(data)) {
                console.error(JSON.stringify(data))
                res.sendStatus(data.httpStatus || 500)
                return
            }
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(data))
        })
        .catch(e => {
            console.error(e)
            res.sendStatus(500)
        })
}
