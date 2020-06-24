import * as iam from '@aws-cdk/aws-iam'
import * as sfn from '@aws-cdk/aws-stepfunctions'
import * as cdk from '@aws-cdk/core'
import { Duration } from '@aws-cdk/core'
import { StepFunctionProps, task } from './constructs'

export const publishArchiverStepFunction = (
    scope: cdk.Construct,
    {
        stack,
        stage,
        deployBucket,
        proofBucket,
        publishBucket,
        frontsTopicArn,
        frontsTopicRoleArn,
        guNotifyServiceApiKey,
    }: StepFunctionProps,
) => {
    const frontsTopicRole = iam.Role.fromRoleArn(
        scope,
        'publish-fronts-topic-role',
        frontsTopicRoleArn,
    )

    const lambdaParams = {
        stack,
        stage,
        deployBucket,
        proofBucket,
        publishBucket,
        frontsTopicArn,
        frontsTopicRole,
    }

    const copier = task(scope, 'copier', 'Copy Issue', lambdaParams)

    const indexerPublish = task(
        scope,
        'indexerPublish',
        'Generate Index',
        lambdaParams,
    )

    const notification = task(
        scope,
        'notification',
        'Schedule device notification',
        lambdaParams,
        {
            gu_notify_service_api_key: guNotifyServiceApiKey,
        },
    )

    copier.task.next(indexerPublish.task)

    indexerPublish.task.next(notification.task)

    notification.task.next(new sfn.Succeed(scope, 'publish-successfully-archived'))

    const stateMachine = new sfn.StateMachine(scope, 'Archiver Publish State Machine',{
        stateMachineName: `Editions-Archiver-State-Machine-${stage}`,
        definition: copier.task,
        timeout: Duration.minutes(10),
    })

    return stateMachine
}
