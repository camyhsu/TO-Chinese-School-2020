#!/usr/bin/env bash
set -ex

#
# This script packages the TOCS registration front-end code so that it can be uploaded to the server.
# During the build process, it uses the preview configuration which contains the correct back-end base URL.
# It assumes that it will be executed in-place with the current repo directory structure.
#
TIMESTAMP=$(date +"%Y%m%d%H%M")
ARCHIVE_NAME=tocs-front-end-build-preview-$TIMESTAMP

cd ../../tocs/front-end
npm install
cp src/config/default.json src/config/default.json.backup
sed 's/http:\/\/localhost:3001/https:\/\/register-api-test.to-cs.org/g' src/config/default.json.backup >src/config/default.json
npm run build
tar cvf "$ARCHIVE_NAME".tar build/*
gzip "$ARCHIVE_NAME".tar
mv src/config/default.json.backup src/config/default.json
mv "$ARCHIVE_NAME".tar.gz ../../cloud-ops/deployment/

