import express = require('express')
import { Request, Response } from 'express'
import { ImageSize, coloursPath } from '../common/src/index'
import { issuePath, mediaPath, frontPath, issueSummaryPath } from './common'
import listEndpoints from 'express-list-endpoints'

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

    const issueId = asPreview
        ? ':edition/:date/preview'
        : ':edition/:date/:version'

    app.use((req, res, next) => {
        console.log(req.url)
        console.log(JSON.stringify(req.params))
        next()
    })

    app.get('/issues', controllers.issuesSummaryController)
    app.get(
        '/' + issueSummaryPath(':edition'),
        controllers.issuesSummaryController,
    )
    app.get('/' + issuePath(issueId), controllers.issueController)
    app.get('/' + frontPath(issueId, '*?'), controllers.frontController)

    app.get(
        '/' + mediaPath(issueId, ':size' as ImageSize, ':source', '*?'),
        controllers.imageController,
    )

    app.get(
        '/' + coloursPath(issueId, ':source', '*?'),
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
