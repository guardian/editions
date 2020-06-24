import { CfnOutput, Construct, Duration, Tag } from '@aws-cdk/core'
import { Code } from '@aws-cdk/aws-lambda'
import lambda = require('@aws-cdk/aws-lambda')
import { IBucket } from '@aws-cdk/aws-s3'
import { proofArchiverStepFunction } from './proof-step-function'
import iam = require('@aws-cdk/aws-iam')

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
        'EditionsProofArchiverS3EventListener',
        {
            functionName: `editions-proof-archiver-s3-event-listener-${stage}`,
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
    //proof archiver step function
    const proofArchiverStateMachine = proofArchiverStepFunction(scope, {
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

    new CfnOutput(scope, 'proof-archiver-state-machine-arn', {
        description: 'ARN for proof archiver state machine',
        exportName: `proof-archiver-state-machine-arn-${stage}`,
        value: proofArchiverStateMachine.stateMachineArn,
    })

    const proofArchiveS3EventListener = s3EventListenerFunction(
        scope,
        'editions-proof-archiver-s3-event-listener',
        stack,
        stage,
        deployBucket,
        proofArchiverStateMachine.stateMachineArn,
        frontsRoleARN,
    )

    new CfnOutput(scope, 'proof-archiver-s3-event-listener-arn', {
        description: 'ARN for proof-archiver state machine trigger lambda',
        exportName: `proof-archiver-s3-event-listener-arn-${stage}`,
        value: proofArchiveS3EventListener.functionArn,
    })

    new lambda.CfnPermission(
        scope,
        'PublishedEditionsProofArchiverS3EventListenerInvokePermission',
        {
            principal: 's3.amazonaws.com',
            functionName: proofArchiveS3EventListener.functionName,
            action: 'lambda:InvokeFunction',
            sourceAccount: cmsFrontsAccountIdParameter,
            sourceArn: publishedBucket.bucketArn,
        },
    )

    proofArchiveS3EventListener.addToRolePolicy(
        new iam.PolicyStatement({
            actions: ['sts:AssumeRole'],
            resources: [frontsAccessArn],
        }),
    )
    proofArchiverStateMachine.grantStartExecution(proofArchiveS3EventListener)
}
