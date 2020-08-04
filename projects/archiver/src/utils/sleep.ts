import { integer } from "aws-sdk/clients/cloudfront";

export const sleep = (waitTimeInMs: integer) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
