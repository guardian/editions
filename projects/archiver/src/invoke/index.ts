import { Handler } from 'aws-lambda'
import { StepFunctions } from 'aws-sdk'
import { randomBytes } from 'crypto'
import {
    Attempt,
    attempt,
    Failure,
    hasFailed,
    hasSucceeded,
    withFailureMessage,
    IssuePublicationIdentifier,
    IssuePublicationActionIdentifier,
} from '../../common'
import { IssueParams } from '../tasks/issue'
import { fetchfromCMSFrontsS3, GetS3ObjParams } from '../utils/s3'
import { parseRecord } from './parser'

export interface Record {
    s3: { bucket: { name: string }; object: { key: string } }
    eventTime: string
} //partial of https://docs.aws.amazon.com/AmazonS3/latest/dev/notification-content-structure.html

const sf = new StepFunctions({
    region: 'eu-west-1',
})

const getRuntimeInvokeStateMachineFunction = (stateMachineArn: string) => {
    return async (
        issuePublication: IssuePublicationIdentifier,
    ): Promise<IssuePublicationIdentifier | Failure> => {
        const invoke: IssueParams = {
            issuePublication,
        }
        const run = await attempt(
            sf
                .startExecution({
                    stateMachineArn,
                    input: JSON.stringify(invoke),
                    name: `issue ${invoke.issuePublication.issueDate} ${
                        invoke.issuePublication.version
                    } ${randomBytes(2).toString('hex')}`.replace(
                        /\W/g,
                        '-', // see character restrictions
                        //https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html
                    ),
                })
                .promise(),
        )
        if (hasFailed(run)) {
            const msg = `⚠️ Invocation of ${JSON.stringify(
                issuePublication,
            )} failed.`
            console.error(msg)
            return withFailureMessage(run, msg)
        }
        console.log(
            `Invocation of step function for ${JSON.stringify(
                issuePublication,
            )} succesful`,
        )
        return issuePublication
    }
}

export interface InvokerDependencies {
    proofStateMachineInvoke: (
        issuePub: IssuePublicationIdentifier,
    ) => Promise<IssuePublicationIdentifier | Failure>
    publishStateMachineInvoke: (
        issuePub: IssuePublicationIdentifier,
    ) => Promise<IssuePublicationIdentifier | Failure>
    s3fetch: (params: GetS3ObjParams) => Promise<string>
}

export const internalHandler = async (
    Records: Record[],
    dependencies: InvokerDependencies,
) => {
    const maybeIssuesPromises: Promise<
        Attempt<IssuePublicationActionIdentifier>
    >[] = Records.map(async r => {
        return await parseRecord(r, dependencies.s3fetch)
    })

    const maybeIssues: Attempt<
        IssuePublicationActionIdentifier
    >[] = await Promise.all(maybeIssuesPromises)

    const issues: IssuePublicationActionIdentifier[] = maybeIssues.filter(
        hasSucceeded,
    )

    console.log('Found following issues:', JSON.stringify(issues))

    const runs = await Promise.all(
        issues.map(issuePublication => {
            if (issuePublication.action === "proof")
                return dependencies.proofStateMachineInvoke(issuePublication as IssuePublicationIdentifier)
            else
                return dependencies.publishStateMachineInvoke(issuePublication as IssuePublicationIdentifier);
        })
    )

    const succesfulInvocations = runs
        .filter(hasSucceeded)
        .map(issue => `✅ Invocation of ${JSON.stringify(issue)} succeeded.`)
    const failedInvocations = runs.filter(hasFailed)
    console.error(JSON.stringify([...failedInvocations]))
    if (succesfulInvocations.length < 1)
        throw new Error('No invocations were made.')
    return [...succesfulInvocations, ...failedInvocations]
}

export const handler: Handler<
    {
        Records: Record[]
    },
    (string | Failure)[]
> = async ({ Records }) => {
    const proofStateMachineArnEnv = 'proofStateMachineARN'
    const proofStateMachineArn = process.env[proofStateMachineArnEnv]
    const publishStateMachineArnEnv = 'publishStateMachineARN'
    const publishStateMachineArn = process.env[publishStateMachineArnEnv]

    if (proofStateMachineArn == null) {
        throw new Error('No Proof State Machine ARN configured')
    }
    if (publishStateMachineArn == null) {
        throw new Error('No Publish State Machine ARN configured')
    }

    console.log(
        `Attempting to invoke Proof/Publish State Machines after receiving records:`,
        Records,
    )

    const runtimeDependencies: InvokerDependencies = {
        proofStateMachineInvoke: getRuntimeInvokeStateMachineFunction(
            proofStateMachineArn,
        ),
        publishStateMachineInvoke: getRuntimeInvokeStateMachineFunction(
            publishStateMachineArn,
        ),
        s3fetch: fetchfromCMSFrontsS3,
    }

    return internalHandler(Records, runtimeDependencies)
}
