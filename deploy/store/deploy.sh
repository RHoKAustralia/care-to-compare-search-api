#!/usr/bin/env bash

set -euxo pipefail

docker run --rm \
    -v "`pwd`:/cwd" \
    -e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY -e AWS_SESSION_TOKEN \
    -e AWS_DEFAULT_REGION \
    realestate/stackup:1.2.0 care-to-compare-assets up \
    -t /cwd/deploy/sis-store.yml \
    -o DomainName=caretocompare.com.au \
    -o FullDomainName=assets.caretocompare.com.au
