import express = require('express')
import { Request, Response } from 'express'
import { logger } from './logger'
import { MallardLogFormat } from '../Apps/common/src/logging'

const processLog = (rawData: MallardLogFormat[]) => {
    rawData.forEach(logData => {
        if (logData.timestamp && logData.message) {
            logger.info({ '@timestamp': logData.timestamp, ...logData })
        } else {
            logger.info('Missing timestamp or message fields')
        }
    })
}

export const createApp = (): express.Application => {
    const app: express.Application = express()

    app.get('/healthcheck', (req: Request, res: Response) => {
        console.log('Healthcheck')
        res.send('I am the editions logger')
    })

    app.post('/log/mallard', express.json(), (req: Request, res: Response) => {
        const apiKeyHeader = req.headers.apikey
        // the below check has been disabled until we're able to do a new release of the app
        // it now passes if apiKeyHeader is missing or undefined
        if (apiKeyHeader && apiKeyHeader !== process.env.API_KEY) {
            logger.warn(
                `Missing or invalid api key. Key received: ${apiKeyHeader}`,
            )
            res.status(403).send(
                `Missing or invalid apikey header: ${apiKeyHeader} is invalid`,
            )
        } else if (req.body) {
            const data = Array.isArray(req.body) ? req.body : [req.body]
            processLog(data)
            res.send('Log success')
        } else {
            logger.info(`Missing request body`)
            res.status(400).send('Missing request body')
        }
    })

    return app
}
