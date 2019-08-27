import cdk = require('@aws-cdk/core')
import lambda = require('@aws-cdk/aws-lambda')
import { Code, FunctionProps } from '@aws-cdk/aws-lambda'
import s3 = require('@aws-cdk/aws-s3')
import iam = require('@aws-cdk/aws-iam')
import sfn = require('@aws-cdk/aws-stepfunctions')
import tasks = require('@aws-cdk/aws-stepfunctions-tasks')
import { toTitleCase } from './tools'
import { Duration } from '@aws-cdk/core'
import { Condition } from '@aws-cdk/aws-stepfunctions'
interface StepFunctionProps {
    stack: string
    stage: string
    deployBucket: s3.IBucket
    outputBucket: s3.IBucket
    backendURL: string
    frontsTopicArn: string
    frontsTopicRoleArn: string
}

//Make sure you add the lambda name in riff-raff.yaml
const taskLambda = (
    name: string,
    {
        scope,
        stack,
        stage,
        deployBucket,
        outputBucket,
    }: {
        scope: cdk.Construct
        stack: string
        stage: string
        deployBucket: s3.IBucket
        outputBucket: s3.IBucket
    },
    environment?: { [key: string]: string },
    overrides?: Partial<FunctionProps>,
) => {
    return new lambda.Function(scope, `EditionsArchiver${toTitleCase(name)}`, {
        functionName: `editions-archiver-stepmachine-${name}-${stage}`,
        runtime: lambda.Runtime.NODEJS_10_X,
        timeout: Duration.minutes(5),
        memorySize: 1500,
        code: Code.bucket(
            deployBucket,
            `${stack}/${stage}/archiver/archiver.zip`,
        ),
        handler: `index.${name}`,
        environment: {
            ...environment,
            stage: stage,
            bucket: outputBucket.bucketName,
        },
        initialPolicy: [
            new iam.PolicyStatement({
                actions: ['*'],
                resources: [
                    outputBucket.arnForObjects('*'),
                    outputBucket.bucketArn,
                ],
            }),
        ],
        ...overrides,
    })
}

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
    }: StepFunctionProps,
) => {
    const lambdaParams = {
        scope,
        stack,
        stage,
        deployBucket,
        outputBucket,
    }
    //Archiver step function
    const issue = taskLambda('issue', lambdaParams, { backend: backendURL })

    const issueTask = new sfn.Task(scope, 'Fetch Issue', {
        task: new tasks.InvokeFunction(issue),
    })

    const front = taskLambda('front', lambdaParams, { backend: backendURL })

    const frontTask = new sfn.Task(scope, 'Fetch and save front', {
        task: new tasks.InvokeFunction(front),
    })
    const image = taskLambda('image', lambdaParams, { backend: backendURL })

    const imageTask = new sfn.Task(scope, 'Fetch Images', {
        task: new tasks.InvokeFunction(image),
    })

    const upload = taskLambda('upload', lambdaParams)

    const uploadTask = new sfn.Task(scope, 'Upload issue file', {
        task: new tasks.InvokeFunction(upload),
    })

    const zip = taskLambda('zip', lambdaParams)

    const zipTask = new sfn.Task(scope, 'Make issue bundle', {
        task: new tasks.InvokeFunction(zip),
    })

    const indexer = taskLambda('indexer', lambdaParams)

    const indexerTask = new sfn.Task(scope, 'Generate Index', {
        task: new tasks.InvokeFunction(indexer),
    })
    const frontsTopicRole = iam.Role.fromRoleArn(
        scope,
        'fronts-topic-role',
        frontsTopicRoleArn,
    )
    const event = taskLambda(
        'event',
        lambdaParams,
        {
            topic: frontsTopicArn,
            role: frontsTopicRoleArn,
        },
        {
            initialPolicy: [
                new iam.PolicyStatement({
                    actions: ['sts:AssumeRole'],
                    resources: [frontsTopicRole.roleArn],
                }),
            ],
        },
    )

    const eventTask = new sfn.Task(scope, 'Send Event', {
        task: new tasks.InvokeFunction(event),
    })

    //Fetch issue metadata
    issueTask.next(frontTask)

    frontTask.next(imageTask)

    const remainingFronts = new sfn.Choice(scope, 'Check for remaining fronts')
    remainingFronts.when(
        Condition.numberGreaterThan('$.remainingFronts', 0),
        frontTask,
    )
    remainingFronts.otherwise(uploadTask)

    imageTask.next(remainingFronts)

    uploadTask.next(zipTask)

    zipTask.next(eventTask)

    eventTask.next(indexerTask)

    indexerTask.next(new sfn.Succeed(scope, 'successfully-archived'))

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
