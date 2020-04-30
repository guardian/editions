import express = require('express')
import { Request, Response } from 'express'

interface LogStashFormat {
    '@timestamp': string
    level: string
    message: string
    extraFields?: Map<string, any>
}

const prepareForLogStash = (logData: any): LogStashFormat => {
    return {
        '@timestamp': logData.timestamp || Date.now(),
        level: logData.level || 'INFO',
        message: logData.message || '',
    }
}

export const createApp = (): express.Application => {
    const app: express.Application = express()

    app.use((req, res, next) => {
        // console.log(req.url) // uncomment this to enable request path logging
        next()
    })

    app.get('/healthcheck', (req: Request, res: Response) => {
        console.log('Healthcheck')
        res.send('I am the editions logger')
    })

    app.post('/log', express.json(), (req: Request, res: Response) => {
        const logData = prepareForLogStash(req.body)
        console.log({
            ...logData,
            ...logData.extraFields,
        })
        res.send('this is the log endpoint')
    })

    return app
}
