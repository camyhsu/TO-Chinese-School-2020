#!/usr/bin/env bash
set -ex

#
# This script starts the TOCS registration back-end code to the preview environment.
#
cd /var/www/preview/back-end
npm install
NODE_ENV=preview pm2 start src/server.js

