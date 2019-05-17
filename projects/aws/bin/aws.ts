#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { EditionsStack } from '../lib/aws-stack';

const app = new cdk.App();
new EditionsStack(app, 'EditionsStack');
