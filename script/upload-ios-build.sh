#!/bin/bash
curl -X POST -d '{"ref":"main","environment":"internal-beta"}' https://api.github.com/repos/guardian/editions/deployments --header "Content-Type:application/json" --header "Authorization:token $GITHUB_TOKEN"
