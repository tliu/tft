#!/bin/bash

docker build . -t localhost:32000/tft
docker push localhost:32000/tft
kubectl rollout restart deployment tft
