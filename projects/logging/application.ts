import express = require('express')
import { Request, Response } from 'express'
import { logger } from './logger'

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

    app.get('/healthcheck', (req: Request, res: Response) => {
        console.log('Healthcheck')
        res.send('I am the editions logger')
    })

    app.post('/log', express.json(), (req: Request, res: Response) => {
        const logData = prepareForLogStash(req.body)
        logger.info({
            ...logData,
            // TODO: this is unsafe, extraFields should have a type imported from common lib shared with Mallard
            ...req.body.extraFields,
        })
        res.send('this is the log endpoint')
    })

    return app
}
