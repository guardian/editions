import cdk = require('@aws-cdk/core')
import lambda = require('@aws-cdk/aws-lambda')
import { Code, FunctionProps } from '@aws-cdk/aws-lambda'
import s3 = require('@aws-cdk/aws-s3')
import iam = require('@aws-cdk/aws-iam')
import sfn = require('@aws-cdk/aws-stepfunctions')
import tasks = require('@aws-cdk/aws-stepfunctions-tasks')
import { toTitleCase } from './tools'
import { Duration } from '@aws-cdk/core'
interface StepFunctionProps {
    stack: string
    stage: string
    deployBucket: s3.IBucket
    outputBucket: s3.IBucket
    backendURL: string
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
    { stack, stage, deployBucket, outputBucket, backendURL }: StepFunctionProps,
) => {
    const issue = taskLambda(
        'issue',
        {
            scope,
            stack,
            stage,
            deployBucket,
            outputBucket,
        },
        { backend: backendURL },
    )

    //Archiver step function
    const issueTask = new sfn.Task(scope, 'Archive Job', {
        task: new tasks.InvokeFunction(issue),
    })

    const hasFinished = new sfn.Choice(scope, 'Has finished', {})

    hasFinished.when(
        sfn.Condition.booleanEquals('$.finished', false),
        issueTask,
    )
    hasFinished.otherwise(new sfn.Succeed(scope, 'successfully-archived'))

    issueTask.next(hasFinished)

    const archiverStateMachine = new sfn.StateMachine(
        scope,
        'Archiver State Machine',
        {
            definition: issueTask,
            timeout: Duration.minutes(5),
        },
    )

    return archiverStateMachine
}
