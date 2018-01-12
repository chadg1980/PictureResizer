#!/bin/bash
echo "starting..."
ntpdate -s time.nist.gov
rm -rf .lambda
node-lambda deploy
node-lambda deploy --prebuiltDirectory ./node_modules
echo "complete"

