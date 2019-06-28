require('dotenv').config()

import awsServerlessExpress from 'aws-serverless-express'
import { Handler } from 'aws-lambda'
import express = require('express')
import { issueController, issuesSummaryController } from './controllers/issue'
import { frontController, collectionsController } from './controllers/fronts'
import { weatherController } from './controllers/weather'
import {
    issuePath,
    frontPath,
    collectionPath,
    issueSummaryPath,
} from './common'

const app = express()

app.get('/' + issueSummaryPath(), issuesSummaryController)

app.get('/' + issuePath(':issueId'), issueController)

app.get('/' + frontPath(':issueId', '*?'), frontController)

app.get(
    '/' + collectionPath(':issueId', ':collectionId'),
    collectionsController,
)

app.get('/weather/ipaddress/:ipAddress', weatherController)

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({ client: '🦆' }))
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

    app.listen(port, () =>
        console.log(`Editions backend listening on port ${port}!`),
    )
}
