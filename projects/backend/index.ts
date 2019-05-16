require('dotenv').config()

import express = require('express')
import fetch from 'node-fetch'
import {
    BufferedTransport,
    CompactProtocol,
} from '@creditkarma/thrift-server-core'
import { ItemResponseCodec } from '@guardian/capi-ts'
import { getIssue, getCollectionsForFront, getCollection } from './fronts'
const app = express()
// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(3000, () => console.log(`Example app listening on port 👌🏻!`))
const port = 3131
const url = (path: string) =>
    `https://content.guardianapis.com/${path}?format=thrift&api-key=${
        process.env.CAPI_KEY
    }&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all`

const getArticle = async (path: string) => {
    const resp = await fetch(url(path))
    const buffer = await resp.arrayBuffer()

    const receiver: BufferedTransport = BufferedTransport.receiver(
        new Buffer(buffer),
    )
    const input = new CompactProtocol(receiver)

    const data = ItemResponseCodec.decode(input)
    const title = data && data.content && data.content.webTitle
    const body =
        data &&
        data.content &&
        data.content.blocks &&
        data.content.blocks.body &&
        data.content.blocks.body.map(_ => _.elements)
    return [title, body]
}
app.get('/edition/:editionId', (req, res) => {
    const id: string = req.params.editionId
    getIssue(id).then(data => {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(data))
    })
})

app.get('/front/*?', (req, res) => {
    const id: string = req.params[0]
    getCollectionsForFront(id).then(data => {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(data))
    })
})

app.get('/collection/:collectionId', (req, res) => {
    const id: string = req.params.collectionId
    getCollection(id).then(data => {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(data))
    })
})

app.get('/content/*?', (req, res) => {
    console.log(req.params)
    const path: string = req.params[0]
    console.log(path)
    getArticle(path).then(data => {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(data))
    })
})

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({ client: '🦆' }))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
