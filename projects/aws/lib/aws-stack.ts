import cdk = require('@aws-cdk/cdk');
import apigateway = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");
import s3 = require("@aws-cdk/aws-s3");

import { Code } from '@aws-cdk/aws-lambda';
// import { Bucket } from '@aws-cdk/aws-s3';

export class EditionsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const stackParameter = new cdk.CfnParameter(this, "stack", { type: "String", description: "Stack" })
        const appParameter = new cdk.CfnParameter(this, "app", { type: "String", description: "App" })
        const stageParameter = new cdk.CfnParameter(this, "stage", { type: "String", description: "Stage" })

        const deploy = new s3.Bucket(this, 'editions-dist')

        const backend = new lambda.Function(this, "EditionsBackend", {
            runtime: lambda.Runtime.NodeJS810,
            code: Code.bucket(deploy,
                `${stackParameter.value}/${stageParameter.value}/${appParameter.value}/${appParameter.value}.zip`),
            handler: "handler"
        })

        new apigateway.LambdaRestApi(this, `${stageParameter.value}-${appParameter.value}-endpoint`, {
            handler: backend
        })

        deploy.grantRead(backend)

    }
}
