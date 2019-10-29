import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import { Code, FunctionProps } from '@aws-cdk/aws-lambda'
import { Duration, Tag } from '@aws-cdk/core'
import { toTitleCase } from './tools'
import * as s3 from '@aws-cdk/aws-s3'
import * as iam from '@aws-cdk/aws-iam'
import * as sfn from '@aws-cdk/aws-stepfunctions'
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks'

export interface StepFunctionProps {
    stack: string
    stage: string
    deployBucket: s3.IBucket
    outputBucket: s3.IBucket
    backendURL: string
    frontsTopicArn: string
    frontsTopicRoleArn: string
    guNotifyServiceApiKey: string
}
export interface LambdaParams {
    stack: string
    stage: string
    deployBucket: s3.IBucket
    outputBucket: s3.IBucket
    frontsTopicArn: string
    frontsTopicRole: iam.IRole
}

export const taskLambda = (
    scope: cdk.Construct,
    name: string,
    {
        stack,
        stage,
        deployBucket,
        outputBucket,
        frontsTopicArn,
        frontsTopicRole,
    }: LambdaParams,
    environment?: { [key: string]: string },
    overrides?: Partial<FunctionProps>,
) => {
    const fn = new lambda.Function(
        scope,
        `EditionsArchiver${toTitleCase(name)}`,
        {
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
                topic: frontsTopicArn,
                role: frontsTopicRole.roleArn,
            },
            initialPolicy: [
                new iam.PolicyStatement({
                    actions: ['*'],
                    resources: [
                        outputBucket.arnForObjects('*'),
                        outputBucket.bucketArn,
                    ],
                }),
                new iam.PolicyStatement({
                    actions: ['sts:AssumeRole'],
                    resources: [frontsTopicRole.roleArn],
                }),
            ],
            ...overrides,
        },
    )
    Tag.add(fn, 'App', `editions-archiver-${name}`)
    Tag.add(fn, 'Stage', stage)
    Tag.add(fn, 'Stack', stack)
    return fn
}

export const task = (
    scope: cdk.Construct,
    name: string,
    desc: string,
    lambdaParams: LambdaParams,
    environment?: { [key: string]: string },
    overrides?: Partial<FunctionProps>,
) => {
    const lambda = taskLambda(
        scope,
        'front',
        lambdaParams,
        environment,
        overrides,
    )

    const task = new sfn.Task(scope, [name, desc].join(': '), {
        task: new tasks.InvokeFunction(lambda),
    })
    return { lambda, task }
}
