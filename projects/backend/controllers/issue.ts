import { Request, Response } from 'express'
import { groupBy } from 'ramda'
import { IssueId, IssueSummary, notNull } from '../common'
import { getIssue } from '../issue'
import { lastModified } from '../lastModified'
import { isPreview as isPreviewStage } from '../preview'
import { s3List } from '../s3'
import { Attempt, hasFailed } from '../utils/try'

export const LIVE_PAGE_SIZE = 7
export const PREVIEW_PAGE_SIZE = 35

export const issueController = (req: Request, res: Response) => {
    const issueDate: string = req.params.date
    const version: string = decodeURIComponent(
        isPreviewStage ? 'preview' : req.params.version,
    )
    const issueId: IssueId = {
        issueDate,
        version,
        edition: 'daily-edition',
    }
    const [date, updater] = lastModified()
    console.log(`${req.url}: request for issue ${issueDate}`)
    getIssue(issueId, updater)
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
interface IssuePublication extends IssueId {
    publicationDate: Date
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
    const issuePublications: IssuePublication[] = issueKeys.map(
        ({ key, lastModified }) => {
            const [, issueDate, filename] = key.split('/')
            const publicationDate = lastModified
            const version = filename.replace('.json', '')
            return {
                edition: 'daily-edition',
                issueDate,
                version,
                publicationDate,
            }
        },
    )

    const issues = Object.values(
        groupBy(_ => _.issueDate, issuePublications),
    ).map(versions =>
        versions.reduce((a, b) =>
            a.publicationDate.getTime() > b.publicationDate.getTime() ? a : b,
        ),
    )
    return issues
        .map(id => {
            const date = new Date(id.issueDate)
            if (isNaN(date.getTime())) {
                console.warn(
                    `Issue with path ${JSON.stringify(id)} is not a valid date`,
                )
                return null
            }
            return { id, date }
        })
        .filter(notNull)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .map(({ id, date }) => ({
            key: id.issueDate,
            name: 'Daily Edition',
            date: date.toISOString(),
            id,
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
