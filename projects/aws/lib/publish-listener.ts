import { CfnOutput, Construct } from '@aws-cdk/core'
import { IBucket } from '@aws-cdk/aws-s3'
import { publishArchiverStepFunction } from './publish-step-function'


// This file is a misnomer: it does not create a listener.
// This lambda function is to be directly kicked off by a call from the Fronts Tool only.

// We will have to add a role (here) which can then be granted to the Fronts Tool instances.

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

}
