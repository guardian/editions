require('dotenv').config()

import awsServerlessExpress from 'aws-serverless-express'
import { Handler } from 'aws-lambda'
import express = require('express')
import { issueController, issuesSummaryController } from './controllers/issue'
import { frontController } from './controllers/fronts'
import { imageController, imageColourController } from './controllers/image'
import { ImageSize, coloursPath } from '../common/src/index'
import { issuePath, mediaPath, frontPath, issueSummaryPath } from './common'

const app = express()

app.get('/' + issueSummaryPath(), issuesSummaryController)

app.get('/' + issuePath(':issueId'), issueController)

app.get('/' + frontPath(':issueId', '*?'), frontController)

app.get(
    '/' + mediaPath(':issueId', ':size' as ImageSize, ':source', '*?'),
    imageController,
)

app.get('/' + coloursPath(':issueId', ':source', '*?'), imageColourController)

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({ client: '🦆' }))
})

app.get('/*?', redirectController)
console.log(JSON.stringify(app._router.stack, null, 2))
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
