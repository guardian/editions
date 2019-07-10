import { Request, Response } from 'express'

import { s3fetch, s3Latest } from '../s3'
import { Issue, IssueSummary } from '../common'
import { lastModified, LastModifiedUpdater } from '../lastModified'
import { IssueResponse } from '../fronts/issue'

const getIssue = async (
    issue: string,
    lastModifiedUpdater: LastModifiedUpdater,
): Promise<Issue | 'notfound'> => {
    const latest = await s3Latest(`daily-edition/${issue}/`)

    const x = await s3fetch(latest)
    if (x.status === 404) return 'notfound'
    if (!x.ok) throw new Error('failed s3')
    lastModifiedUpdater(x.lastModified)
    const data = (await x.json()) as IssueResponse
    const fronts = data.fronts.map(_ => _.name)
    return {
        name: data.name,
        key: data.id,
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
            res.setHeader('Last-Modifed', date())
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(data))
        })
        .catch(e => console.error(e))
}

const getIssuesSummary = async (): Promise<IssueSummary[] | 'notfound'> => {
    return Promise.resolve([
        {
            key: '2019-03-11',
            name: 'Daily Edition',
            date: '2019-03-11T00:00:00Z',
        },
    ])
}

export const issuesSummaryController = (req: Request, res: Response) => {
    console.log('Issue summary requested.')
    getIssuesSummary()
        .then(data => {
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(data))
        })
        .catch(e => console.error(e))
}
