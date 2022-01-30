#!/usr/bin/env bash
set -ex

#
# This script updates the TOCS registration front-end code to the preview environment.
# It assumes that it will be executed from the intended deployment directory.
#
CODE_PACKAGE=$1

# Move the code to the right location
tar zxvf $CODE_PACKAGE
rm -rf /var/www/preview/front-end/*
cp -r build/* /var/www/preview/front-end/
rm -rf build

