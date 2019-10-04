import express = require('express')
import { Request, Response } from 'express'
import { ImageSize, coloursPath } from '../common/src/index'
import { issuePath, mediaPath, frontPath, issueSummaryPath } from './common'
import listEndpoints from 'express-list-endpoints'
import { pickIssuePathSegments } from './utils/issue'

export interface EditionsBackendControllers {
    issuesSummaryController: (req: Request, res: Response) => void
    issueController: (req: Request, res: Response) => void
    frontController: (req: Request, res: Response) => void
    imageController: (req: Request, res: Response) => void
    imageColourController: (req: Request, res: Response) => void
}

export const createApp = (
    controllers: EditionsBackendControllers,
    asPreview: boolean,
): express.Application => {
    const app: express.Application = express()

    if (asPreview) {
        console.log('🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞')
        console.log('🗞🗞🗞 HOT OFF THE PRESS THIS IS PREVIEW🗞🗞🗞')
        console.log('🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞')
    }

    const issuePathSegments = pickIssuePathSegments(asPreview)

    app.use((req, res, next) => {
        console.log(req.url)
        console.log(JSON.stringify(req.params))
        next()
    })

    // this next line supports legacy clients and can be removed after beta
    // it should return the issues list for the daily-edition
    app.get('/issues', controllers.issuesSummaryController)

    app.get(
        '/' + issueSummaryPath(':edition'),
        controllers.issuesSummaryController,
    )
    app.get('/' + issuePath(issuePathSegments), controllers.issueController)
    app.get(
        '/' + frontPath(issuePathSegments, '*?'),
        controllers.frontController,
    )

    app.get(
        '/' +
            mediaPath(issuePathSegments, ':size' as ImageSize, ':source', '*?'),
        controllers.imageController,
    )

    app.get(
        '/' + coloursPath(issuePathSegments, ':source', '*?'),
        controllers.imageColourController,
    )

    const endpoints = listEndpoints(app)

    const rootPath = '/'

    app.get(rootPath, (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(endpoints)
    })
    return app
}
