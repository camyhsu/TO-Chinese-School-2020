#!/usr/bin/env bash
set -ex

#
# This script packages the TOCS registration back-end code so that it can be uploaded to the server.
# It assumes that it will be executed in-place with the current repo directory structure.
#
TIMESTAMP=$(date +"%Y%m%d%H%M")
ARCHIVE_NAME=tocs-back-end-build-$TIMESTAMP

cd ../../tocs/back-end
tar cvf "$ARCHIVE_NAME".tar config/default.json package* src
gzip "$ARCHIVE_NAME".tar
mv "$ARCHIVE_NAME".tar.gz ../../cloud-ops/deployment/
