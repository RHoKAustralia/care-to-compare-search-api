#!/bin/bash -el

$(aws ecr get-login --no-include-email --region ap-southeast-2)
docker build -t search-api .

docker tag search-api:latest 702557701840.dkr.ecr.ap-southeast-2.amazonaws.com/search-api:latest
docker push 702557701840.dkr.ecr.ap-southeast-2.amazonaws.com/search-api:latest
