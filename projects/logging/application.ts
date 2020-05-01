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

const processLog = (rawData: any[]) => {
    rawData.forEach(rd => {
        const logData = prepareForLogStash(rd)
        logger.info({
            ...logData,
            // TODO: this is unsafe, extraFields should have a type imported from common lib shared with Mallard
            ...rd.extraFields,
        })
    })
}

export const createApp = (): express.Application => {
    const app: express.Application = express()

    app.get('/healthcheck', (req: Request, res: Response) => {
        console.log('Healthcheck')
        res.send('I am the editions logger')
    })

    app.post('/log', express.json(), (req: Request, res: Response) => {
        if (req.body.apiKey !== process.env.API_KEY) {
            res.status(403).send('Missing or invalid apiKey')
        } else if (req.body.logData) {
            const data = Array.isArray(req.body.logData)
                ? req.body.logData
                : [req.body.logData]
            processLog(data)
            res.send('Log success')
        } else {
            res.status(400).send(
                'apiKey or logData fields missing in request body',
            )
        }
    })

    return app
}
