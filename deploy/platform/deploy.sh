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
  "vpc.yaml"
  "subnet.yaml"
)

for TEMPLATE in "${TEMPLATES[@]}"
do
  echo "INFO: [`date +"%T"`] Finding ${TEMPLATE}..."
  echo ""
  echo "INFO: [`date +"%T"`] Validating Template ${DIR}/${TEMPLATE}"
  aws cloudformation validate-template --template-body file://${DIR}/${TEMPLATE}
done

cd ${DIR}

TEMPLATE="vpc.yaml"
TYPE="${TEMPLATE%.*}"
STACK_NAME="caretocompare-${ENVIRONMENT}-${TYPE}"

echo ""
echo "INFO: [`date +"%T"`] Deploying to ${STACK_NAME} for environment ${ENVIRONMENT}"
docker run --rm \
    -v `pwd`:/cwd \
    -e AWS_ACCESS_KEY_ID \
    -e AWS_SECRET_ACCESS_KEY \
    -e AWS_SESSION_TOKEN \
    -e AWS_DEFAULT_REGION \
    realestate/stackup:1.1.1 "${STACK_NAME}" up -t ${TEMPLATE} \
    -p parameters.${TYPE}.yaml \
    -o Name=${TYPE} \
    -o Environment=${ENVIRONMENT} \
    -o QualifiedName=${STACK_NAME}

TEMPLATE="subnet.yaml"
TYPE="${TEMPLATE%.*}"
STACK_NAME="caretocompare-${ENVIRONMENT}-${TYPE}"
VPC_ID=$(aws cloudformation describe-stacks --stack-name caretocompare-${ENVIRONMENT}-vpc --output text --query 'Stacks[0].Outputs[?OutputKey==`VPCId`].OutputValue')

echo "INFO: [`date +"%T"`] Loading VPC Id: ${VPC_ID}."
echo ""

echo ""
echo "INFO: [`date +"%T"`] Deploying to ${STACK_NAME} for environment ${ENVIRONMENT}"
docker run --rm \
    -v `pwd`:/cwd \
    -e AWS_ACCESS_KEY_ID \
    -e AWS_SECRET_ACCESS_KEY \
    -e AWS_SESSION_TOKEN \
    -e AWS_DEFAULT_REGION \
    realestate/stackup:1.1.1 "${STACK_NAME}" up -t ${TEMPLATE} \
    -p parameters.${TYPE}.yaml \
    -o Name=${TYPE} \
    -o Environment=${ENVIRONMENT} \
    -o QualifiedName=${STACK_NAME} \
    -o VPCId=${VPC_ID}

echo "INFO: [`date +"%T"`] Done."

