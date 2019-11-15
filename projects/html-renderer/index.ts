import awsServerlessExpress from 'aws-serverless-express'
import { Handler } from 'aws-lambda'
import { app } from './src/server'

export const handler: Handler = (event, context) => {
    awsServerlessExpress.proxy(
        awsServerlessExpress.createServer(app),
        event,
        context,
    )
}

if (require.main === module) {
    const port = 3232

    app.listen(port, () => {
        console.log(`Editions HTML renderer available on ${port}!`)
    })
}
