#!/bin/bash
echo "starting..."
rm -rf .lambda
node-lambda deploy
node-lambda deploy --prebuiltDirectory ./node_modules
echo "complete"

