
# New Registration App Deployment

This file documents the steps performed when deploying the new registration app.  The new registration app in the year 
2021 is written in NodeJS / Express / React, instead of the older Ruby on Rails stack.  This document is intended for 
reference / backup purpose, but there is no expectation that we have to go through this again from scratch, unless 
somehow we lost all snapshot backup of the boot disk.

## Update NodeJS on Ubuntu

When the server was first setup in early 2021 in Google Compute Engine, the NodeJS was installed through NodeSource 
repos and was version 14.x.  NodeJS LTS version will move from 14.x to 16.x in October 2021.  Hence, we should update 
the NodeJS version to 16.x before deploying the new app (some time in Q4 of 2021).

Since the version 14.x was installed through the NodeSource repo, the best way to update NodeJS version is to remove 
version 14.x completely and then install version 16.x through the same NodeSource mechanism.

1. Connect as your user then change to the root user:
    1. `gcloud compute ssh registration-wp-west1-b-1`
    2. After connected, change to root user:
       ```shell
       sudo -u root -H bash --login
       cd
       ```

2. Purge the version 14.x package installation and remove the NodeSource repo for 14.x:
   ```shell
   apt-get --purge remove nodejs
   rm /etc/apt/sources.list.d/nodesource.list
   ```

3. Download the setup script from NodeSource:
   ```shell
   curl -fsSL -o setup-nodejs16 https://deb.nodesource.com/setup_16.x
   ```

4. Install nodejs:
   ```shell
   bash setup-nodejs16
   apt-get install -y nodejs
   ```
   After the installation, the vesrion can be verified by simple checks such as `node -v`





