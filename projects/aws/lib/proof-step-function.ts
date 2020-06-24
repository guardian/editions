import * as iam from '@aws-cdk/aws-iam'
import * as sfn from '@aws-cdk/aws-stepfunctions'
import * as cdk from '@aws-cdk/core'
import { Duration } from '@aws-cdk/core'
import { StepFunctionProps, task } from './constructs'

export const proofArchiverStepFunction = (
    scope: cdk.Construct,
    {
        stack,
        stage,
        deployBucket,
        proofBucket,
        publishBucket,
        backendURL,
        frontsTopicArn,
        frontsTopicRoleArn,
    }: StepFunctionProps,
) => {
    const frontsTopicRole = iam.Role.fromRoleArn(
        scope,
        'proof-fronts-topic-role',
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
    //Archiver step function
    const issue = task(scope, 'issue', 'Fetch Issue', lambdaParams, {
        backend: backendURL,
    })

    const frontMap = new sfn.Map(scope, 'EditionsArchiverFrontMap', {
        itemsPath: '$.issue.fronts',
        parameters: {
            'issue.$': '$.issue',
            'front.$': '$$.Map.Item.Value',
        },
        resultPath: 'DISCARD', //This makes the output from this be replaced with the input
    })

    const front = task(
        scope,
        'front',
        'Fetch front and images',
        { retry: true, ...lambdaParams },
        {
            backend: backendURL,
        },
    )

    const upload = task(scope, 'upload', 'Upload Issue', lambdaParams)

    const zip = task(scope, 'zip', 'Make issue bundle', lambdaParams)

    const indexerProof = task(
        scope,
        'indexerProof',
        'Generate Index',
        lambdaParams,
    )

    issue.task.next(frontMap)

    frontMap.iterator(front.task)

    frontMap.next(upload.task)

    upload.task.next(zip.task)

    zip.task.next(indexerProof.task)

    indexerProof.task.next(new sfn.Succeed(scope, 'successfully-archived'))

    const stateMachine = new sfn.StateMachine(scope,'Archiver State Machine',{
        stateMachineName: `Editions-Archiver-State-Machine-${stage}`,
        definition: issue.task,
        timeout: Duration.minutes(10),
    })

    return stateMachine
}
