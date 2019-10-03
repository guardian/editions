require('dotenv').config()

import awsServerlessExpress from 'aws-serverless-express'
import { Handler } from 'aws-lambda'
import express = require('express')
import { issueController, issuesSummaryController } from './controllers/issue'
import { frontController } from './controllers/fronts'
import { imageController, imageColourController } from './controllers/image'
import { ImageSize, coloursPath } from '../common/src/index'
import { issuePath, mediaPath, frontPath, issueSummaryPath } from './common'
import { isPreview } from './preview'
import listEndpoints from 'express-list-endpoints'

const app = express()

if (isPreview) {
    console.log('🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞')
    console.log('🗞🗞🗞 HOT OFF THE PRESS THIS IS PREVIEW🗞🗞🗞')
    console.log('🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞🗞')
}

const issueId = isPreview
    ? 'daily-edition/:date/preview'
    : 'daily-edition/:date/:version'

app.use((req, res, next) => {
    console.log(req.url)
    console.log(JSON.stringify(req.params))
    next()
})

// this next line supports legacy clients and can be removed after beta
// it should return the issues list for the daily-edition
app.get('/issues', issuesSummaryController)

app.get('/' + issueSummaryPath('daily-edition'), issuesSummaryController)
app.get('/' + issuePath(issueId), issueController)
console.log('/' + issuePath(issueId))
app.get('/' + frontPath(issueId, '*?'), frontController)

app.get(
    '/' + mediaPath(issueId, ':size' as ImageSize, ':source', '*?'),
    imageController,
)

app.get('/' + coloursPath(issueId, ':source', '*?'), imageColourController)

const endpoints = listEndpoints(app)

const rootPath = '/'

app.get(rootPath, (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(endpoints)
})

export const handler: Handler = (event, context) => {
    awsServerlessExpress.proxy(
        awsServerlessExpress.createServer(app),
        event,
        context,
    )
}

if (require.main === module) {
    const port = 3131

    app.listen(port, () => {
        console.log(`Editions backend listening on port ${port}!`)
        console.log('Editions backend endpoints list available at root path')
    })
}
