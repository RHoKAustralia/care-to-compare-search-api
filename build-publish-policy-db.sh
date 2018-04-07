#!/bin/bash -el

VERSION=1.0.${BUILD_NUMBER:-0}

docker stop policy-store || true
docker rm -f $(docker ps -a -q) || true

docker run \
    --publish=27017:27017 \
    --volume $(pwd)/data/db:/data/db \
    --volume=$(pwd)/data/seed-data:/input-data \
    --name policy-store \
    -d \
    mongo
docker exec -it policy-store \
    bash -c "mongoimport --db policy-search-db --collection policies --drop --type json --file /input-data/policies-2018.json --jsonArray"
docker exec -it policy-store bash -c "mongo policy-search-db /input-data/update-schema.js"

docker stop policy-store || true
docker rm -f $(docker ps -a -q) || true

docker build -t policy-store .

docker tag policy-store:latest 702557701840.dkr.ecr.ap-southeast-2.amazonaws.com/policy-store:${VERSION}
$(aws ecr get-login --no-include-email --region ap-southeast-2)
docker push 702557701840.dkr.ecr.ap-southeast-2.amazonaws.com/policy-store:${VERSION}
