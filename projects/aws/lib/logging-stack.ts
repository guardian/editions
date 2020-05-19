import cdk = require('@aws-cdk/core')
import apigateway = require('@aws-cdk/aws-apigateway')
import lambda = require('@aws-cdk/aws-lambda')
import { Code } from '@aws-cdk/aws-lambda'
import s3 = require('@aws-cdk/aws-s3')
import iam = require('@aws-cdk/aws-iam')
import { CfnOutput, Duration, Tag } from '@aws-cdk/core'
import { Effect } from '@aws-cdk/aws-iam'
import { EndpointType } from '@aws-cdk/aws-apigateway'
import acm = require('@aws-cdk/aws-certificatemanager')

export class LoggingStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const stackParameter = new cdk.CfnParameter(this, 'stack', {
            type: 'String',
            description: 'Stack',
        })

        const stageParameter = new cdk.CfnParameter(this, 'stage', {
            type: 'String',
            description: 'Stage',
        })

        const apiKeyParameter = new cdk.CfnParameter(this, 'apiKey', {
            type: 'String',
            description: 'Shared secret for log endpoint.',
            default: 'changeme',
        })

        const loggingCertificateArn = new cdk.CfnParameter(
            this,
            'logging-certificate-arn',
            {
                type: 'String',
                description: 'ARN of ACM certificate for logging endpoint',
            },
        )

        const loggingHostName = new cdk.CfnParameter(this, 'logging-hostname', {
            type: 'String',
            description: 'Hostname for logging endpoint',
        })

        const loggingCertificate = acm.Certificate.fromCertificateArn(
            this,
            'logging-certificate',
            loggingCertificateArn.valueAsString,
        )

        const deployBucket = s3.Bucket.fromBucketName(
            this,
            'editions-dist',
            'editions-dist',
        )
        const loggingFunction = () => {
            const fn = new lambda.Function(this, `EditionsLogging`, {
                functionName: `editions-logging-${stageParameter.valueAsString}`,
                runtime: lambda.Runtime.NODEJS_10_X,
                memorySize: 128,
                timeout: Duration.seconds(5),
                code: Code.bucket(
                    deployBucket,
                    `${stackParameter.valueAsString}/${stageParameter.valueAsString}/logging/logging.zip`,
                ),
                handler: 'index.handler',
                environment: {
                    STAGE: stageParameter.valueAsString,
                    STACK: stackParameter.valueAsString,
                    APP: 'editions-logging',
                    API_KEY: apiKeyParameter.valueAsString,
                },
            })
            Tag.add(fn, 'App', `editions-logging`)
            Tag.add(fn, 'Stage', stageParameter.valueAsString)
            Tag.add(fn, 'Stack', stackParameter.valueAsString)
            return fn
        }

        const loggingBackend = loggingFunction()

        const loggingApiPolicyStatement = new iam.PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['execute-api:Invoke'],
            resources: ['*'],
        })
        loggingApiPolicyStatement.addAnyPrincipal()

        const loggingApi = new apigateway.LambdaRestApi(
            this,
            'editions-logging',
            {
                handler: loggingBackend,
                endpointTypes: [EndpointType.EDGE],
                policy: new iam.PolicyDocument({
                    statements: [loggingApiPolicyStatement],
                }),
            },
        )

        const loggingDomainName = new apigateway.DomainName(
            this,
            'logging-domain-name',
            {
                domainName: loggingHostName.valueAsString,
                certificate: loggingCertificate,
                endpointType: apigateway.EndpointType.EDGE,
            },
        )

        loggingDomainName.addBasePathMapping(loggingApi)

        new CfnOutput(this, 'Logging-Api-Target-Hostname', {
            description: 'hostname',
            value: `${loggingDomainName.domainNameAliasDomainName}`,
        })
    }
}
