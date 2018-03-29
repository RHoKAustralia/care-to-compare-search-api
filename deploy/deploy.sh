#!/bin/bash -el

if [ -z ${ENVIRONMENT} ]; then
  ENVIRONMENT=$1
fi

if [ -z ${ENVIRONMENT} ]; then
  echo "Environment Name / Identifier is required for launching of the stack"
  echo "Please set the ENVIRONMENT environment variable"
  exit 255
fi

VERSION=1.0.${BUILD_NUMBER:-0}
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

TEMPLATES=(
  "searchapi.yml"
)

for TEMPLATE in "${TEMPLATES[@]}"
do
  echo "INFO: [`date +"%T"`] Finding ${TEMPLATE}..."
  echo ""
  echo "INFO: [`date +"%T"`] Validating Template ${DIR}/${TEMPLATE}"
  aws cloudformation validate-template --template-body file://${DIR}/${TEMPLATE}
done

cd ${DIR}

TEMPLATE="searchapi.yml"
TYPE="${TEMPLATE%.*}"
STACK_NAME="caretocompare-${ENVIRONMENT}-${TYPE}"
VPC_ID=$(aws cloudformation describe-stacks --stack-name caretocompare-${ENVIRONMENT}-vpc --output text --query 'Stacks[0].Outputs[?OutputKey==`VPCId`].OutputValue')
SUBNET_IDS=$(aws cloudformation describe-stacks --stack-name caretocompare-${ENVIRONMENT}-subnet --output text --query 'Stacks[0].Outputs[?OutputKey==`PublicSubnetIds`].OutputValue')

echo ""
echo "INFO: [`date +"%T"`] Deploying to ${STACK_NAME} for environment ${ENVIRONMENT}"
docker run --rm \
    -v `pwd`:/cwd \
    -e AWS_ACCESS_KEY_ID \
    -e AWS_SECRET_ACCESS_KEY \
    -e AWS_SESSION_TOKEN \
    -e AWS_DEFAULT_REGION \
    realestate/stackup:1.1.1 "${STACK_NAME}" up -t ${TEMPLATE} \
    -p parameters.${TYPE}.yml \
    -o VpcId=${VPC_ID} \
    -o SubnetId="${SUBNET_IDS}" \
    -o SearchApiVersion=${VERSION}
