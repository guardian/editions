require('dotenv').config()

import awsServerlessExpress from 'aws-serverless-express'
import { Handler } from 'aws-lambda'
import express = require('express')
import fetch from 'node-fetch'
import {
    BufferedTransport,
    CompactProtocol,
} from '@creditkarma/thrift-server-core'
import { ItemResponseCodec } from '@guardian/capi-ts'
import { getCollectionsForFront, getCollection } from './fronts'
import { issueController } from './controllers/issue'
import { articleController } from './controllers/article'
import { frontController, collectionsController } from './controllers/fronts'

const app = express()

app.get('/edition/:editionId', issueController)

app.get('/front/*?', frontController)

app.get('/collection/:collectionId', collectionsController)

app.get('/content/*?', articleController)

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
