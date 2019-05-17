"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/cdk");
const apigateway = require("@aws-cdk/aws-apigateway");
const lambda = require("@aws-cdk/aws-lambda");
const s3 = require("@aws-cdk/aws-s3");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
// import { Bucket } from '@aws-cdk/aws-s3';
class EditionsStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const stackParameter = new cdk.CfnParameter(this, "stack", { type: "String", description: "Stack" });
        const appParameter = new cdk.CfnParameter(this, "app", { type: "String", description: "App" });
        const stageParameter = new cdk.CfnParameter(this, "stage", { type: "String", description: "Stage" });
        const deploy = new s3.Bucket(this, 'editions-dist');
        const backend = new lambda.Function(this, "EditionsBackend", {
            runtime: lambda.Runtime.NodeJS810,
            code: aws_lambda_1.Code.bucket(deploy, `${stackParameter.value}/${stageParameter.value}/${appParameter.value}/${appParameter.value}.zip`),
            handler: "handler"
        });
        new apigateway.LambdaRestApi(this, 'endpoint', {
            handler: backend
        });
        deploy.grantRead(backend);
    }
}
exports.EditionsStack = EditionsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQXFDO0FBQ3JDLHNEQUF1RDtBQUN2RCw4Q0FBK0M7QUFDL0Msc0NBQXVDO0FBRXZDLG9EQUEyQztBQUMzQyw0Q0FBNEM7QUFFNUMsTUFBYSxhQUFjLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDeEMsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUNoRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7UUFDcEcsTUFBTSxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO1FBQzlGLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUVwRyxNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFBO1FBRW5ELE1BQU0sT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDekQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUztZQUNqQyxJQUFJLEVBQUUsaUJBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUNwQixHQUFHLGNBQWMsQ0FBQyxLQUFLLElBQUksY0FBYyxDQUFDLEtBQUssSUFBSSxZQUFZLENBQUMsS0FBSyxJQUFJLFlBQVksQ0FBQyxLQUFLLE1BQU0sQ0FBQztZQUN0RyxPQUFPLEVBQUUsU0FBUztTQUNyQixDQUFDLENBQUE7UUFFRixJQUFJLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUMzQyxPQUFPLEVBQUUsT0FBTztTQUNuQixDQUFDLENBQUE7UUFFRixNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBRTdCLENBQUM7Q0FDSjtBQXZCRCxzQ0F1QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY2RrJyk7XG5pbXBvcnQgYXBpZ2F0ZXdheSA9IHJlcXVpcmUoXCJAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheVwiKTtcbmltcG9ydCBsYW1iZGEgPSByZXF1aXJlKFwiQGF3cy1jZGsvYXdzLWxhbWJkYVwiKTtcbmltcG9ydCBzMyA9IHJlcXVpcmUoXCJAYXdzLWNkay9hd3MtczNcIik7XG5cbmltcG9ydCB7IENvZGUgfSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbi8vIGltcG9ydCB7IEJ1Y2tldCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0aW9uc1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICAgICAgY29uc3Qgc3RhY2tQYXJhbWV0ZXIgPSBuZXcgY2RrLkNmblBhcmFtZXRlcih0aGlzLCBcInN0YWNrXCIsIHsgdHlwZTogXCJTdHJpbmdcIiwgZGVzY3JpcHRpb246IFwiU3RhY2tcIiB9KVxuICAgICAgICBjb25zdCBhcHBQYXJhbWV0ZXIgPSBuZXcgY2RrLkNmblBhcmFtZXRlcih0aGlzLCBcImFwcFwiLCB7IHR5cGU6IFwiU3RyaW5nXCIsIGRlc2NyaXB0aW9uOiBcIkFwcFwiIH0pXG4gICAgICAgIGNvbnN0IHN0YWdlUGFyYW1ldGVyID0gbmV3IGNkay5DZm5QYXJhbWV0ZXIodGhpcywgXCJzdGFnZVwiLCB7IHR5cGU6IFwiU3RyaW5nXCIsIGRlc2NyaXB0aW9uOiBcIlN0YWdlXCIgfSlcblxuICAgICAgICBjb25zdCBkZXBsb3kgPSBuZXcgczMuQnVja2V0KHRoaXMsICdlZGl0aW9ucy1kaXN0JylcblxuICAgICAgICBjb25zdCBiYWNrZW5kID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCBcIkVkaXRpb25zQmFja2VuZFwiLCB7XG4gICAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5Ob2RlSlM4MTAsXG4gICAgICAgICAgICBjb2RlOiBDb2RlLmJ1Y2tldChkZXBsb3ksXG4gICAgICAgICAgICAgICAgYCR7c3RhY2tQYXJhbWV0ZXIudmFsdWV9LyR7c3RhZ2VQYXJhbWV0ZXIudmFsdWV9LyR7YXBwUGFyYW1ldGVyLnZhbHVlfS8ke2FwcFBhcmFtZXRlci52YWx1ZX0uemlwYCksXG4gICAgICAgICAgICBoYW5kbGVyOiBcImhhbmRsZXJcIlxuICAgICAgICB9KVxuXG4gICAgICAgIG5ldyBhcGlnYXRld2F5LkxhbWJkYVJlc3RBcGkodGhpcywgJ2VuZHBvaW50Jywge1xuICAgICAgICAgICAgaGFuZGxlcjogYmFja2VuZFxuICAgICAgICB9KVxuXG4gICAgICAgIGRlcGxveS5ncmFudFJlYWQoYmFja2VuZClcblxuICAgIH1cbn1cbiJdfQ==