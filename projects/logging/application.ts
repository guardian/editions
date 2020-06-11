import express = require('express')
import { Request, Response } from 'express'
import { logger } from './logger'
import { MallardLogFormat } from '../Apps/common/src/logging'
import sizeOf from 'object-sizeof'

const maxLogSize = parseInt(process.env.MAX_LOG_SIZE || '0')

const processLog = (rawData: MallardLogFormat[]) => {
    rawData.forEach(logData => {
        if (logData.message) {
            const elkJsonObject = {
                clientTimestamp: logData.timestamp,
                ...logData,
                // override any stage/stack/app properties included in logData
                stack: process.env.STACK,
                stage: process.env.STAGE,
                app: process.env.APP,
            }
            // let's rely on cloudwatch timestamp
            delete elkJsonObject.timestamp
            logger.info(elkJsonObject)
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

    const logEndpointEnabled = process.env.LOG_ENDPOINT_ENABLED === 'true'
    const logEndpoint = '/log/mallard'

    if (logEndpointEnabled) {
        app.post(
            logEndpoint,
            express.json({ limit: '10mb' }),
            (req: Request, res: Response) => {
                if (req.body) {
                    const data = Array.isArray(req.body) ? req.body : [req.body]
                    const dataSize = sizeOf(data)
                    if (dataSize < maxLogSize) {
                        processLog(data)
                        res.send('Log success')
                    } else {
                        logger.error(
                            `Request body too large. Estimated size: ${dataSize}, max size: ${maxLogSize}.`,
                        )
                        res.send('Log skipped (too large)')
                    }
                } else {
                    logger.info(`Missing request body`)
                    res.status(400).send('Missing request body')
                }
            },
        )
    } else {
        app.post(logEndpoint, (req: Request, res: Response) => {
            res.send('Logging service disabled')
        })
    }

    return app
}
