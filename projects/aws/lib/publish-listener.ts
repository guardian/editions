import { CfnOutput, Construct, Duration, Tag } from '@aws-cdk/core'
import { Code } from '@aws-cdk/aws-lambda'
import lambda = require('@aws-cdk/aws-lambda')
import { IBucket } from '@aws-cdk/aws-s3'
import iam = require('@aws-cdk/aws-iam')
import { publishArchiverStepFunction } from './publish-step-function'

export const s3EventListenerFunction = (
    scope: Construct,
    app: string,
    stack: string,
    stage: string,
    deployBucket: IBucket,
    stateMachineArn: string,
    frontsRoleARN: string,
) => {
    const fn = new lambda.Function(
        scope,
        'EditionsPublishArchiverS3EventListener',
        {
            functionName: `editions-publish-archiver-s3-event-listener-${stage}`,
            runtime: lambda.Runtime.NODEJS_10_X,
            timeout: Duration.minutes(5),
            memorySize: 256,
            code: Code.bucket(
                deployBucket,
                `${stack}/${stage}/archiver/archiver.zip`,
            ),
            handler: 'index.invoke',
            environment: {
                stage: stage,
                stateMachineARN: stateMachineArn,
                arn: frontsRoleARN,
            },
        },
    )
    Tag.add(fn, 'App', app)
    Tag.add(fn, 'Stage', stage)
    Tag.add(fn, 'Stack', stack)
    return fn
}

export const constructTriggeredStepFunction = (
    scope: Construct,
    stack: string,
    stage: string,
    deployBucket: IBucket,
    proofArchive: IBucket,
    publishArchive: IBucket,
    backendURL: string,
    frontsTopicARN: string,
    frontsTopicRoleARN: string,
    guNotifyServiceApiKeyParameter: string,
    frontsRoleARN: string,
    cmsFrontsAccountIdParameter: string,
    publishedBucket: IBucket,
    frontsAccessArn: string,
) => {
    //publish archiver step function
    const publishArchiverStateMachine = publishArchiverStepFunction(scope, {
        stack: stack,
        stage: stage,
        deployBucket,
        proofBucket: proofArchive,
        publishBucket: publishArchive,
        backendURL,
        frontsTopicArn: frontsTopicARN,
        frontsTopicRoleArn: frontsTopicRoleARN,
        guNotifyServiceApiKey: guNotifyServiceApiKeyParameter,
    })

    new CfnOutput(scope, 'publish-archiver-state-machine-arn', {
        description: 'ARN for publish archiver state machine',
        exportName: `publish-archiver-state-machine-arn-${stage}`,
        value: publishArchiverStateMachine.stateMachineArn,
    })

    const publishArchiveS3EventListener = s3EventListenerFunction(
        scope,
        'editions-publish-archiver-s3-event-listener',
        stack,
        stage,
        deployBucket,
        publishArchiverStateMachine.stateMachineArn,
        frontsRoleARN,
    )

    new CfnOutput(scope, 'publish-archiver-s3-event-listener-arn', {
        description: 'ARN for publish-archiver state machine trigger lambda',
        exportName: `publish-archiver-s3-event-listener-arn-${stage}`,
        value: publishArchiveS3EventListener.functionArn,
    })

    new lambda.CfnPermission(
        scope,
        'PublishedEditionsPublishArchiverS3EventListenerInvokePermission',
        {
            principal: 's3.amazonaws.com',
            functionName: publishArchiveS3EventListener.functionName,
            action: 'lambda:InvokeFunction',
            sourceAccount: cmsFrontsAccountIdParameter,
            sourceArn: publishedBucket.bucketArn,
        },
    )

    publishArchiveS3EventListener.addToRolePolicy(
        new iam.PolicyStatement({
            actions: ['sts:AssumeRole'],
            resources: [frontsAccessArn],
        }),
    )
    publishArchiverStateMachine.grantStartExecution(publishArchiveS3EventListener)
}
