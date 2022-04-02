#!/usr/bin/env bash
set -ex

#
# This script starts the TOCS registration back-end code to the preview environment.
#
cd /var/www/preview/back-end
npm ci
NODE_ENV=preview pm2 --node-args "--experimental-modules --es-module-specifier-resolution=node" start src/server.js

