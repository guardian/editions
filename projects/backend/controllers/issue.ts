import { Request, Response } from 'express'

import { s3List } from '../s3'
import { notNull, IssueSummary } from '../common'
import { lastModified } from '../lastModified'
import { hasFailed, Attempt } from '../utils/try'
import { getIssue } from '../issue'
import { isPreview as isPreviewStage } from '../preview'

export const LIVE_PAGE_SIZE = 7
export const PREVIEW_PAGE_SIZE = 35

export const issueController = (req: Request, res: Response) => {
    const id: string = req.params.issueId
    const source: string = decodeURIComponent(
        isPreviewStage ? 'preview' : req.params.source,
    )
    const [date, updater] = lastModified()
    console.log(`${req.url}: request for issue ${id}`)
    getIssue(id, source, updater)
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

export const getIssuesSummary = async (
    isPreview: boolean,
): Promise<Attempt<IssueSummary[]>> => {
    const issueKeys = await s3List({
        key: 'daily-edition/',
        bucket: isPreview ? 'preview' : 'published',
    })

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
            return { key, date }
        })
        .filter(notNull)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .map(({ key, date }) => ({
            key,
            name: 'Daily Edition',
            date: date.toISOString(),
        }))
        .slice(0, isPreview ? PREVIEW_PAGE_SIZE : LIVE_PAGE_SIZE)
}

export const issuesSummaryController = (req: Request, res: Response) => {
    console.log('Issue summary requested.')
    getIssuesSummary(isPreviewStage)
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
