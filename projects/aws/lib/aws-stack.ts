import cdk = require('@aws-cdk/cdk')
import apigateway = require('@aws-cdk/aws-apigateway')
import lambda = require('@aws-cdk/aws-lambda')
import { Code } from '@aws-cdk/aws-lambda'
import s3 = require('@aws-cdk/aws-s3')

export class EditionsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)
        const stackParameter = new cdk.CfnParameter(this, 'stack', {
            type: 'String',
            description: 'Stack',
        })
        const appParameter = new cdk.CfnParameter(this, 'app', {
            type: 'String',
            description: 'App',
        })
        const stageParameter = new cdk.CfnParameter(this, 'stage', {
            type: 'String',
            description: 'Stage',
        })

        const capiParameter = new cdk.CfnParameter(this, 'capi', {
            type: 'String',
            description: 'Capi key',
        })

        const deploy = s3.Bucket.fromBucketName(
            this,
            'editions-dist',
            'editions-dist',
        )
        const backend = new lambda.Function(this, 'EditionsBackend', {
            functionName: `backend-${stageParameter.stringValue}`,
            runtime: lambda.Runtime.NodeJS810,
            // code: Code.inline(
            //     `module.handler = () => console.log('hi ${
            //         stackParameter.value
            //     }/${stageParameter.value}/${appParameter.value}/${
            //         appParameter.value
            //     }.zip')`,
            // ),
            code: Code.bucket(
                deploy,
                `${stackParameter.stringValue}/${
                    stageParameter.stringValue
                }/backend/backend.zip`,
            ),
            handler: 'index.handler',
            environment: {
                CAPI_KEY: capiParameter.stringValue,
            },
        })

        new apigateway.LambdaRestApi(this, 'endpoint', {
            handler: backend,
            options: {
                restApiName: `${stageParameter.stringValue}-${
                    appParameter.stringValue
                }-endpoint`,
                description: `${stageParameter.stringValue}-${
                    appParameter.stringValue
                }-endpoint`,
            },
        })

        deploy.grantRead(backend)
    }
}
