import { Request, Response } from 'express'
import { IssueSummary, IssuePublicationIdentifier } from '../common'
import { getIssue } from '../issue'
import { isPreview as isPreviewStage } from '../preview'
import { s3fetch, getEditionsBucket } from '../s3'
import { Attempt, hasFailed } from '../utils/try'
import {
    buildEditionRootPath as buildEditionPath,
    decodeVersionOrPreview,
} from '../utils/issue'

export const issueController = (req: Request, res: Response) => {
    const issueDate: string = req.params.date
    const version: string = decodeVersionOrPreview(
        req.params.version,
        isPreviewStage,
    )
    const edition = req.params.edition
    const issue: IssuePublicationIdentifier = {
        issueDate,
        version,
        edition,
    }
    console.log(`${req.url}: request for issue ${issueDate}`)
    getIssue(issue)
        .then(data => {
            if (data === 'notfound') {
                res.sendStatus(404)
                return
            }
            res.setHeader('Last-Modifed', new Date(version).getTime())
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(data))
        })
        .catch(e => console.error(e))
}

export const getIssuesSummary = async (
    maybeEdition: string,
    isPreview: boolean,
): Promise<Attempt<IssueSummary[]>> => {
    console.log('fetching issues summary')
    const editionPath = buildEditionPath(maybeEdition, isPreview)

    const issuePath = {
        key: editionPath.key + 'issues',
        bucket: getEditionsBucket('published'),
    }
    const issueData = await s3fetch(issuePath)

    if (hasFailed(issueData)) {
        console.error('Error in issue index controller')
        console.error(JSON.stringify(issueData))
        return issueData
    }
    const data = (await issueData.json()) as IssueSummary[]
    return data
}

export const issuesSummaryController = (req: Request, res: Response) => {
    const issueEdition = req.params.edition
    getIssuesSummary(issueEdition, isPreviewStage)
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
