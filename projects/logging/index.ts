import { config } from 'dotenv'
config()

import awsServerlessExpress from 'aws-serverless-express'
import { Handler } from 'aws-lambda'
import { createApp } from './application'

const app = createApp()

export const handler: Handler = (event, context) => {
    awsServerlessExpress.proxy(
        awsServerlessExpress.createServer(app),
        event,
        context,
    )
}

if (require.main === module) {
    const port = 3132

    app.listen(port, () => {
        console.log(`Editions logging backend listening on port ${port}!`)
    })
}
