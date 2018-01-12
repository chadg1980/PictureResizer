#!/bin/bash
echo "starting..."
sudo service ntp stop
sudo ntpdate -s time.nist.gov
sudo service ntp start
echo $(date)
rm -rf .lambda
node-lambda deploy
node-lambda deploy --prebuiltDirectory ./node_modules
echo "complete"

