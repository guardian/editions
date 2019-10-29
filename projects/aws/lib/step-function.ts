import * as cdk from '@aws-cdk/core'
import { Condition } from '@aws-cdk/aws-stepfunctions'
import { Duration } from '@aws-cdk/core'
import { StepFunctionProps, task } from './constructs'
import * as iam from '@aws-cdk/aws-iam'
import * as sfn from '@aws-cdk/aws-stepfunctions'

export const archiverStepFunction = (
    scope: cdk.Construct,
    {
        stack,
        stage,
        deployBucket,
        outputBucket,
        backendURL,
        frontsTopicArn,
        frontsTopicRoleArn,
        guNotifyServiceApiKey,
    }: StepFunctionProps,
) => {
    const frontsTopicRole = iam.Role.fromRoleArn(
        scope,
        'fronts-topic-role',
        frontsTopicRoleArn,
    )

    const lambdaParams = {
        stack,
        stage,
        deployBucket,
        outputBucket,
        frontsTopicArn,
        frontsTopicRole,
    }
    //Archiver step function
    const issue = task(scope, 'issue', 'Fetch Issue', lambdaParams, {
        backend: backendURL,
    })

    const frontMap = new sfn.Map(scope, 'Map Fronts', {
        inputPath: '$.',
        itemsPath: '$.fronts',
        parameters: {
            'issuePublication.$': '$.issuePublication',
            'front.$': '$$.Map.Item.Value',
        },
        outputPath: 'DISCARD',
    })

    const image = task(scope, 'image', 'Fetch images', lambdaParams, {
        backend: backendURL,
    })

    const upload = task(scope, 'upload', 'Upload Issue', lambdaParams)

    const zip = task(scope, 'zip', 'Make issue bundle', lambdaParams)

    const indexer = task(scope, 'indexer', 'Generate Index', lambdaParams)

    const notification = task(
        scope,
        'notification',
        'Schedule device notification',
        lambdaParams,
        {
            gu_notify_service_api_key: guNotifyServiceApiKey,
        },
    )

    //Fetch issue metadata
    issue.task.next(front.task)

    front.task.next(image.task)

    const remainingFronts = new sfn.Choice(scope, 'Check for remaining fronts')
    remainingFronts.when(
        Condition.numberGreaterThan('$.remainingFronts', 0),
        frontTask,
    )
    remainingFronts.otherwise(uploadTask)

    imageTask.next(remainingFronts)

    upload.task.next(zip.task)

    zip.task.next(indexer.task)

    indexer.task.next(notification.task)

    notificationTask.next(new sfn.Succeed(scope, 'successfully-archived'))

    const archiverStateMachine = new sfn.StateMachine(
        scope,
        'Archiver State Machine',
        {
            stateMachineName: `Editions-Archiver-State-Machine-${stage}`,
            definition: issueTask,
            timeout: Duration.minutes(5),
        },
    )

    return archiverStateMachine
}
