import cdk = require('@aws-cdk/core')
import apigateway = require('@aws-cdk/aws-apigateway')
import lambda = require('@aws-cdk/aws-lambda')
import { Code } from '@aws-cdk/aws-lambda'
import s3 = require('@aws-cdk/aws-s3')
import iam = require('@aws-cdk/aws-iam')
import cloudfront = require('@aws-cdk/aws-cloudfront')
import { CfnOutput, Duration, Tag } from '@aws-cdk/core'
import acm = require('@aws-cdk/aws-certificatemanager')
import { Effect } from '@aws-cdk/aws-iam'
import { constructTriggeredStepFunction } from './listener'

export class EditionsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)
        const stackParameter = new cdk.CfnParameter(this, 'stack', {
            type: 'String',
            description: 'Stack',
        })

        const frontsStageParameter = new cdk.CfnParameter(this, 'frontsStage', {
            type: 'String',
            description: 'Which stage of fronts to read from',
            allowedValues: ['prod', 'code'],
        })

        const stageParameter = new cdk.CfnParameter(this, 'stage', {
            type: 'String',
            description: 'Stage',
        })

        const capiKeyParameter = new cdk.CfnParameter(this, 'capi', {
            type: 'String',
            description: 'Capi key',
        })

        const guNotifyServiceApiKeyParameter = new cdk.CfnParameter(
            this,
            'gu_notify_service_api_key',
            {
                type: 'String',
                description: 'guardian device notifications service api key',
            },
        )

        const printSentURLParameter = new cdk.CfnParameter(this, 'psurl', {
            type: 'String',
            description: 'print sent url parameter',
        })

        const frontsRoleARN = new cdk.CfnParameter(this, 'fronts-role-arn', {
            type: 'String',
            description: 'fronts s3 access',
        })

        const capiRoleARN = new cdk.CfnParameter(this, 'capi-role-arn', {
            type: 'String',
            description: 'role to access preview capi',
        })

        const capiPreviewUrl = new cdk.CfnParameter(this, 'capi-preview-url', {
            type: 'String',
            description: 'url to access preview capi',
        })

        const frontsTopicARN = new cdk.CfnParameter(this, 'fronts-topic-arn', {
            type: 'String',
            description: 'topic arn for publication messages',
        })

        const frontsTopicRoleARN = new cdk.CfnParameter(
            this,
            'fronts-topic-role-arn',
            {
                type: 'String',
                description: 'topic arn for publication messages',
            },
        )

        const imageSalt = new cdk.CfnParameter(this, 'image-signing-key', {
            type: 'String',
            description: 'image signing',
        })

        const proofArchiveBucketParameter = new cdk.CfnParameter(
            this,
            'proof-archive-bucket-param',
            {
                type: 'String',
                description: 'Proof Archive Bucket',
                allowedValues: ['editions-proof-prod', 'editions-proof-code'],
            },
        )

        const publishArchiveBucketParameter = new cdk.CfnParameter(
            this,
            'publish-archive-bucket-param',
            {
                type: 'String',
                description: 'Publish Archive Bucket',
                allowedValues: ['editions-store-prod', 'editions-store-code'],
            },
        )

        const previewIpAcl = new cdk.CfnParameter(this, 'preview-ip-acl', {
            type: 'List<String>',
            description:
                'List of IP addresses and CIDR blocks from which preview can be accessed',
            default: '77.91.248.0/21',
        })

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

        const deployBucket = s3.Bucket.fromBucketName(
            this,
            'editions-dist',
            'editions-dist',
        )

        const frontsAccess = iam.Role.fromRoleArn(
            this,
            'fronts-role',
            frontsRoleARN.valueAsString,
        )

        const capiAccess = iam.Role.fromRoleArn(
            this,
            'capi-role',
            capiRoleARN.valueAsString,
        )

        const atomLambdaParam = new cdk.CfnParameter(this, 'atom-lambda-arn', {
            type: 'String',
            description: 'lambda access',
        })

        const previewHostname = new cdk.CfnParameter(this, 'preview-hostname', {
            type: 'String',
            description: 'Hostname of the preview endpoint',
        })

        const previewCertificateArn = new cdk.CfnParameter(
            this,
            'preview-certificate-arn',
            {
                type: 'String',
                description: 'ARN of ACM certificate for preview endpoint',
            },
        )

        const previewCertificate = acm.Certificate.fromCertificateArn(
            this,
            'preview-certificate',
            previewCertificateArn.valueAsString,
        )

        const backendFunction = (publicationStage: 'preview' | 'published') => {
            const titleCasePublicationStage =
                publicationStage.charAt(0).toUpperCase() +
                publicationStage.slice(1)
            const fn = new lambda.Function(
                this,
                `Editions${titleCasePublicationStage}Backend`,
                {
                    functionName: `editions-${publicationStage}-backend-${stageParameter.valueAsString}`,
                    runtime: lambda.Runtime.NODEJS_10_X,
                    memorySize: 512,
                    timeout: Duration.seconds(60),
                    code: Code.bucket(
                        deployBucket,
                        `${stackParameter.valueAsString}/${stageParameter.valueAsString}/backend/backend.zip`,
                    ),
                    handler: 'index.handler',
                    environment: {
                        frontsStage: frontsStageParameter.valueAsString,
                        CAPI_KEY: capiKeyParameter.valueAsString,
                        arn: frontsRoleARN.valueAsString,
                        stage: stageParameter.valueAsString,
                        atomArn: atomLambdaParam.valueAsString,
                        psurl: printSentURLParameter.valueAsString,
                        IMAGE_SALT: imageSalt.valueAsString,
                        publicationStage,
                        capiAccessArn: capiRoleARN.valueAsString,
                        capiPreviewUrl: capiPreviewUrl.valueAsString,
                    },
                    initialPolicy: [
                        new iam.PolicyStatement({
                            actions: ['sts:AssumeRole'],
                            resources: [
                                frontsAccess.roleArn,
                                capiAccess.roleArn,
                            ],
                        }),
                        new iam.PolicyStatement({
                            resources: [atomLambdaParam.valueAsString],
                            actions: ['lambda:InvokeFunction'],
                        }),
                    ],
                },
            )
            Tag.add(fn, 'App', `editions-backend-${publicationStage}`)
            Tag.add(fn, 'Stage', stageParameter.valueAsString)
            Tag.add(fn, 'Stack', stackParameter.valueAsString)
            return fn
        }

        const previewBackend = backendFunction('preview')

        const publishedBackend = backendFunction('published')

        const previewApiPolicyStatement = new iam.PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['execute-api:Invoke'],
            resources: ['*'],
            conditions: {
                IpAddress: {
                    'aws:SourceIp': previewIpAcl.valueAsList,
                },
            },
        })
        previewApiPolicyStatement.addAnyPrincipal()

        const previewApi = new apigateway.LambdaRestApi(
            this,
            'editions-preview-backend-apigateway',
            {
                handler: previewBackend,
                // a policy that only allows users access from certain IPs
                policy: new iam.PolicyDocument({
                    statements: [previewApiPolicyStatement],
                }),
            },
        )

        const previewDomainName = new apigateway.DomainName(
            this,
            'preview-domain-name',
            {
                domainName: previewHostname.valueAsString,
                certificate: previewCertificate,
                endpointType: apigateway.EndpointType.REGIONAL,
            },
        )

        previewDomainName.addBasePathMapping(previewApi)

        new CfnOutput(this, 'Preview-Api-Target-Hostname', {
            description: 'hostname',
            value: `${previewDomainName.domainNameAliasDomainName}`,
        })

        const publishedApi = new apigateway.LambdaRestApi(
            this,
            'editions-published-backend-apigateway',
            {
                handler: publishedBackend,
            },
        )

        const previewGatewayId = previewApi.restApiId
        const publishedGatewayId = publishedApi.restApiId

        const backendURL = `${publishedGatewayId}.execute-api.eu-west-1.amazonaws.com/prod/` //Yes, this (the region) really should not be hard coded.

        const previewDist = new cloudfront.CloudFrontWebDistribution(
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
                            domainName: `${previewGatewayId}.execute-api.eu-west-1.amazonaws.com`, //Yes, this (the region) really should not be hard coded.
                        },
                    },
                ],
            },
        )
        new CfnOutput(this, 'Cloudfront-distribution', {
            description: 'URL for distribution',
            value: `https://${previewDist.domainName}`,
        })

        const proofArchive = s3.Bucket.fromBucketName(
            this,
            'proof-archive-bucket',
            proofArchiveBucketParameter.valueAsString,
        )

        const publishArchive = s3.Bucket.fromBucketName(
            this,
            'publish-archive-bucket',
            publishArchiveBucketParameter.valueAsString,
        )

        // This is the bucket to which Fronts Tool writes the
        // JSON which kicks off the proofing process
        const publishedBucket = s3.Bucket.fromBucketName(
            this,
            'published-bucket',
            publishedEditionsBucketnameParameter.valueAsString,
        )

        constructTriggeredStepFunction(
            this,
            stackParameter.valueAsString,
            stageParameter.valueAsString,
            deployBucket,
            proofArchive,
            publishArchive,
            backendURL,
            frontsTopicARN.valueAsString,
            frontsTopicRoleARN.valueAsString,
            guNotifyServiceApiKeyParameter.valueAsString,
            frontsRoleARN.valueAsString,
            cmsFrontsAccountIdParameter.valueAsString,
            publishedBucket,
            frontsAccess.roleArn,
        )
    }
}
