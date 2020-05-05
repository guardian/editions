#!/usr/bin/env node
import 'source-map-support/register'
import cdk = require('@aws-cdk/core')
import { LoggingStack } from '../lib/logging-stack'

const app = new cdk.App()
new LoggingStack(app, 'EditionsLoggingStack')
