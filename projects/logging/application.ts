import express = require('express')
import { Request, Response } from 'express'

export const createApp = (): express.Application => {
    const app: express.Application = express()

    app.use((req, res, next) => {
        console.log(req.url)
        next()
    })

    app.get('/healthcheck', (req: Request, res: Response) => {
        console.log('Healthcheck')
        res.send('I am the editions logger')
    })

    app.post('/log', express.json(), (req: Request, res: Response) => {
        console.log('This is the log endpoint')
        console.log('body: ', req.body)
        res.send('this is the log endpoint')
    })

    return app
}
