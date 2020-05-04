import express = require('express')
import { Request, Response } from 'express'
import { logger } from './logger'
import { LogFormat, Level } from '../Apps/common/src/logging'

const processLog = (rawData: LogFormat[]) => {
    rawData.forEach(logData => {
        logger.info({
            '@timestamp': logData['@timestamp'] || Date.now(),
            level: logData.level || Level.INFO,
            message: logData.message || '',
            ...logData.metadata,
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
        if (req.headers.apikey !== process.env.API_KEY) {
            res.status(403).send('Missing or invalid apikey header')
        } else if (req.body) {
            const data = Array.isArray(req.body) ? req.body : [req.body]
            processLog(data)
            res.send('Log success')
        } else {
            res.status(400).send('Missing apikey or request body')
        }
    })

    return app
}
