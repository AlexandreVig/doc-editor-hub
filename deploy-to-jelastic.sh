#!/bin/bash

# Function to display usage
usage() {
  echo "Usage: $0 --hoster-api-host <host> --env-name <env_name> --session <session> --tag <tag> --node-id <node_id> --use-existing-volumes <true|false>"
  exit 1
}

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --hoster-api-host) HOSTER_API_HOST="$2"; shift ;;
    --env-name) ENV_NAME="$2"; shift ;;
    --session) SESSION="$2"; shift ;;
    --tag) TAG="$2"; shift ;;
    --node-id) NODE_ID="$2"; shift ;;
    --use-existing-volumes) USE_EXISTING_VOLUMES="$2"; shift ;;
    *) usage ;;
  esac
  shift
done

# Construct the API endpoint
API_URL="https://${HOSTER_API_HOST}/1.0/environment/control/rest/redeploycontainers"
DATA="envName=${ENV_NAME}&session=${SESSION}&tag=${TAG}&nodeId=${NODE_ID}&useExistingVolumes=${USE_EXISTING_VOLUMES}"

# Make the API request
response=$(curl -s -X POST "${API_URL}?${DATA}")

# Check the response
echo "Response: $response"