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

        const imageSalt = new cdk.CfnParameter(this, 'image-signing-key', {
            type: 'String',
            description: 'image signing',
        })

        const archiveBucketParameter = new cdk.CfnParameter(
            this,
            'archive-bucket-param',
            {
                type: 'String',
                description: 'Archive Bucket',
                default: 'editions-store',
                allowedValues: ['editions-store', 'editions-store-code'],
            },
        )

        const cmsFrontsAccountIdParameter = new cdk.CfnParameter(
            this,
            'cmsFronts-account-id-param',
            {
                type: 'String',
                description: 'Account id for cmsFronts account.',
            },
        )

        const publishedEditionsBucketnameParameter = new cdk.CfnParameter(
            this,
            'published-editions-bucket-name-param',
            {
                type: 'String',
                description: 'Name for published editions bucket',
            },
        )

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
            memorySize: 512,
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
                IMAGE_SALT: imageSalt.valueAsString,
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
                        behaviors: [
                            {
                                isDefaultBehavior: true,
                                defaultTtl: Duration.seconds(10),
                            },
                        ],
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

        const archive = s3.Bucket.fromBucketName(
            this,
            'archive-bucket',
            archiveBucketParameter.valueAsString,
        )

        const archiver = new lambda.Function(this, 'EditionsArchiver', {
            functionName: `editions-archiver-${stageParameter.valueAsString}`,
            runtime: lambda.Runtime.NODEJS_10_X,
            timeout: Duration.minutes(5),
            memorySize: 1500,
            code: Code.bucket(
                deploy,
                `${stackParameter.valueAsString}/${stageParameter.valueAsString}/archiver/archiver.zip`,
            ),
            handler: 'index.handler',
            environment: {
                stage: stageParameter.valueAsString,
                bucket: archive.bucketName,
                backend: `${gatewayId}.execute-api.eu-west-1.amazonaws.com/prod/`, //Yes, this (the region) really should not be hard coded.
            },
        })

        const archiverPolicy = new iam.PolicyStatement({
            actions: ['*'],
            resources: [archive.arnForObjects('*'), archive.bucketArn],
        })

        archiver.addToRolePolicy(archiverPolicy)

        new lambda.CfnPermission(
            this,
            'PublishedEditionsArchiverInvokePermission',
            {
                principal: 's3.amazonaws.com',
                functionName: archiver.functionName,
                action: 'lambda:InvokeFunction',
                sourceAccount: cmsFrontsAccountIdParameter.valueAsString,
                sourceArn: `arn:aws:s3:::${publishedEditionsBucketnameParameter.valueAsString}`
            },
        )
    }
}
