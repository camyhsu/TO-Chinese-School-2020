#!/usr/bin/env bash
set -ex

#
# This script updates the TOCS registration back-end code to the preview environment.
# It assumes that it will be executed from the intended deployment directory and the target application is
# already running (an older version) with pm2.
#
CODE_PACKAGE=$1

# Move the code and configuration to the right locations
cp $CODE_PACKAGE /var/www/preview/back-end/
cd /var/www/preview/back-end
tar zxvf $CODE_PACKAGE
rm $CODE_PACKAGE
cp ~/deployment/back-end-preview.json config/preview.json

# Run NPM install
npm install

# There could be steps for updating database here, but we have not run into this yet

# Trigger PM2 reload
pm2 reload all
