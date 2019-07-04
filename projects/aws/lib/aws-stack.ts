import cdk = require('@aws-cdk/core')
import apigateway = require('@aws-cdk/aws-apigateway')
import lambda = require('@aws-cdk/aws-lambda')
import { Code } from '@aws-cdk/aws-lambda'
import s3 = require('@aws-cdk/aws-s3')
import iam = require('@aws-cdk/aws-iam')
import cloudfront = require('@aws-cdk/aws-cloudfront')
import { CfnOutput, Duration } from '@aws-cdk/core'

export class EditionsStack extends cdk.Stack {
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

        const capiKeyParameter = new cdk.CfnParameter(this, 'capi', {
            type: 'String',
            description: 'Capi key',
        })

        const printSentURLParameter = new cdk.CfnParameter(this, 'psurl', {
            type: 'String',
            description: 'print sent url parameter',
        })

        const frontsRoleARN = new cdk.CfnParameter(this, 'fronts-role-arn', {
            type: 'String',
            description: 'fronts access',
        })

        const deploy = s3.Bucket.fromBucketName(
            this,
            'editions-dist',
            'editions-dist',
        )

        const frontsAccess = iam.Role.fromRoleArn(
            this,
            'fronts-role',
            frontsRoleARN.valueAsString,
        )

        const atomLambdaParam = new cdk.CfnParameter(this, 'atom-lambda-arn', {
            type: 'String',
            description: 'lambda access',
        })

        const backend = new lambda.Function(this, 'EditionsBackend', {
            functionName: `editions-backend-${stageParameter.valueAsString}`,
            runtime: lambda.Runtime.NODEJS_10_X,
            timeout: Duration.seconds(60),
            code: Code.bucket(
                deploy,
                `${stackParameter.valueAsString}/${stageParameter.valueAsString}/backend/backend.zip`,
            ),
            handler: 'index.handler',
            environment: {
                CAPI_KEY: capiKeyParameter.valueAsString,
                arn: frontsRoleARN.valueAsString,
                stage: stageParameter.valueAsString,
                atomArn: atomLambdaParam.valueAsString,
                psurl: printSentURLParameter.valueAsString,
            },
        })

        const policy = new iam.PolicyStatement({
            actions: ['sts:AssumeRole'],
            resources: [frontsAccess.roleArn],
        })

        backend.addToRolePolicy(policy)

        const atomPolicy = new iam.PolicyStatement({
            resources: [atomLambdaParam.valueAsString],
            actions: ['lambda:InvokeFunction'],
        })

        backend.addToRolePolicy(atomPolicy)

        const gateway = new apigateway.LambdaRestApi(
            this,
            'editions-backend-apigateway',
            {
                handler: backend,
            },
        )

        const gatewayId = gateway.restApiId

        const dist = new cloudfront.CloudFrontWebDistribution(
            this,
            'backend-cloudfront-distribution',
            {
                comment: `Cloudfront distribution for editions ${stageParameter.valueAsString}`,
                defaultRootObject: '',
                originConfigs: [
                    {
                        originPath: '/prod', //This is hard coded and could be the deployment id
                        behaviors: [{ isDefaultBehavior: true }],
                        customOriginSource: {
                            domainName: `${gatewayId}.execute-api.eu-west-1.amazonaws.com`, //Yes, this (the region) really should not be hard coded.
                        },
                    },
                ],
            },
        )
        new CfnOutput(this, 'Cloudfront-distribution', {
            description: 'URL for distribution',
            value: `https://${dist.domainName}`,
        })
    }
}
